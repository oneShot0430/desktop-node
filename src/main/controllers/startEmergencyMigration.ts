import { Event } from 'electron';

import axios, { AxiosError } from 'axios';

import { EMERGENCY_TESTNET_RPC_URL } from 'config/node';
import koiiTasks from 'main/services/koiiTasks';
import { OwnerAccount, TaskData, getAllAccountsResponse } from 'models';

import { getAllAccounts } from './getAllAccounts';
import getUserConfig from './getUserConfig';
import { setActiveAccount } from './setActiveAccount';
import { storeTaskToMigrate } from './storeTaskToMigrate';
import storeUserConfig from './storeUserConfig';
import { switchNetwork } from './switchNetwork';

export const startEmergencyMigration = async () => {
  await recordAllTasksAndStakes();
  await changeToEmergencyNetworkRPCUrl();

  const userConfig = await getUserConfig();
  await storeUserConfig({} as Event, {
    settings: { ...userConfig, hasStartedEmergencyMigration: true },
  });
  console.log('TESTNET MIGRATION: finished 1st phase of network migration');
};
const recordAllTasksAndStakes = async () => {
  const allAccounts = await getAllAccounts({} as Event, false);

  for (const account of allAccounts) {
    console.log(
      `MIGRATE NETWORK: setting account ${account.accountName} as active account`
    );
    await setActiveAccount({} as Event, { accountName: account.accountName });
    console.log(
      `MIGRATE NETWORK: set account ${account.accountName} as active account`
    );
    await recordTasksAndStakesForAccount(account);
  }
};
const recordTasksAndStakesForAccount = async (
  account: getAllAccountsResponse[0]
) => {
  const allMyTasks = await koiiTasks.getStartedTasksPubKeys();

  await Promise.all(
    allMyTasks.map(async (publicKey) => {
      await recordTaskAndStake(publicKey, account);
      koiiTasks.removeTaskFromStartedTasks(publicKey);
    })
  );
};

const getTaskState = async (taskPublicKey: string) => {
  const response = await axios.get<TaskData>(
    `https://faucet-api.koii.network/api/get-task-state/${taskPublicKey}`
  );

  return response.data;
};

const recordTaskAndStake = async (
  taskPublicKey: string,
  account: OwnerAccount
) => {
  try {
    const taskState: TaskData = await getTaskState(taskPublicKey);
    const stakeOnTask = taskState?.stakeList?.[account.stakingPublicKey] || 0;
    const hasStakeOnTask = stakeOnTask > 0;
    const taskCanBeMigrated = hasStakeOnTask && taskState.isActive;

    if (taskCanBeMigrated) {
      const taskToMigrateRecord = {
        publicKey: taskPublicKey,
        stake: stakeOnTask,
        ...account,
      };
      console.log(
        `MIGRATE NETWORK: recording task ${taskPublicKey} with stake ${stakeOnTask} ROE, from account ${account.accountName}`
      );
      await storeTaskToMigrate(taskToMigrateRecord);
      console.log(
        `MIGRATE NETWORK: recorded task ${taskPublicKey} with stake ${stakeOnTask} ROE, from account ${account.accountName}`
      );
    }
  } catch (error) {
    if (error instanceof AxiosError) {
      const taskIsOldAndInactive =
        error.response?.data.message.includes('not a valid taskID');
      if (!taskIsOldAndInactive) {
        throw error;
      }
    }
    console.log(error);
  }
};

const changeToEmergencyNetworkRPCUrl = async () =>
  switchNetwork({} as Event, EMERGENCY_TESTNET_RPC_URL);
