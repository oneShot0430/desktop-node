import { Event } from 'electron';
import https from 'https';

import { Keypair, LAMPORTS_PER_SOL } from '@_koi/web3.js';
import axios, { AxiosError } from 'axios';
import bs58 from 'bs58';
import {
  getMainSystemAccountKeypair,
  getStakingAccountKeypair,
} from 'main/node/helpers';
import { TaskToMigrate } from 'models';
// eslint-disable-next-line @cspell/spellchecker
import nacl from 'tweetnacl';

import delegateStake from './delegateStake';
import { getTaskInfo } from './getTaskInfo';
import { getTasksToMigrate } from './getTasksToMigrate';
import getUserConfig from './getUserConfig';
import { setRunnedPrivateTask } from './privateTasks';
import { setActiveAccount } from './setActiveAccount';
import startTask from './startTask';
import storeUserConfig from './storeUserConfig';
import { getPairedTaskVariableData, pairTaskVariable } from './taskVariables';

const SAFE_TIMEOUT = 5000;

interface PublicKeys {
  oldPublicKey: string;
  newPublicKey: string;
}

const delay = (ms: number) =>
  new Promise((resolve) => {
    setTimeout(resolve, ms);
  });

export const finishEmergencyMigration = async () => {
  const oldTasksToMigrate = await getTasksToMigrate();
  console.log(
    'TESTNET MIGRATION: starting network migration for tasks: ',
    oldTasksToMigrate
  );

  for (const taskToMigrate of Object.values(oldTasksToMigrate)) {
    try {
      await migrateTask(taskToMigrate);
      await delay(SAFE_TIMEOUT);
    } catch (error) {
      if (error instanceof AxiosError) {
        const originalTaskIsOldAndInactive = error.response?.status === 422;
        if (!originalTaskIsOldAndInactive) {
          throw error;
        }
      }
      console.log(error);
    }
  }

  await setEmergencyMigrationAsFinished();
  console.log('TESTNET MIGRATION: finished 2nd phase of network migration');
};

const migrateTask = async ({
  stake,
  publicKey: oldPublicKey,
  accountName,
}: TaskToMigrate) => {
  const newPublicKey = await getNewTaskVersion(oldPublicKey);

  console.log(`TESTNET MIGRATION: setting ${accountName} as active account`);
  await setActiveAccount({} as Event, { accountName });
  console.log(`TESTNET MIGRATION: set ${accountName} as active account`);
  console.log(
    `TESTNET MIGRATION: redeeming tokens from old task ${oldPublicKey} for account ${accountName} in new network`
  );
  await redeemTokensInNewNetwork();
  delay(SAFE_TIMEOUT);

  console.log(
    `TESTNET MIGRATION: redeemed tokens from old task ${oldPublicKey} for account ${accountName} in new network`
  );
  console.log(
    `TESTNET MIGRATION: migrating variables from old task ${oldPublicKey} to new task ${newPublicKey}`
  );
  await migrateTaskVariables({ oldPublicKey, newPublicKey });
  console.log(
    `TESTNET MIGRATION: migrated variables from old task ${oldPublicKey} to new task ${newPublicKey}`
  );
  console.log(
    `TESTNET MIGRATION: staking ${stake} ROE on new task ${newPublicKey} from account ${accountName}`
  );

  await delegateStake({} as Event, {
    taskAccountPubKey: newPublicKey,
    stakeAmount: stake / LAMPORTS_PER_SOL,
  });

  console.log(
    `TESTNET MIGRATION: staked ${stake} ROE on new task ${newPublicKey} from account ${accountName}`
  );
  console.log(
    `TESTNET MIGRATION: running new task ${newPublicKey} from account ${accountName}`
  );
  await startNewTask(newPublicKey);
  console.log(
    `TESTNET MIGRATION: runned new task ${newPublicKey} from account ${accountName}`
  );
};

const setEmergencyMigrationAsFinished = async () => {
  const userConfig = await getUserConfig();
  await storeUserConfig({} as Event, {
    settings: { ...userConfig, hasFinishedEmergencyMigration: true },
  });
};

const getNewTaskVersion = async (oldPublicKey: string) => {
  const response = await axios.get<{ migratedTo: string }>(
    `https://faucet-api.koii.network/api/get-migrated-task/${oldPublicKey}`
  );

  return response.data.migratedTo;
};

const migrateTaskVariables = async ({
  oldPublicKey,
  newPublicKey,
}: PublicKeys) => {
  const oldTaskPairedTaskVariables = (
    await getPairedTaskVariableData({
      taskAccountPubKey: oldPublicKey,
      shouldValidateTask: false,
    })
  )?.taskPairings;

  if (oldTaskPairedTaskVariables) {
    const pairingPromises = Object.entries(oldTaskPairedTaskVariables).map(
      ([variableInTaskName, desktopVariableId]) =>
        pairTaskVariable({} as Event, {
          taskAccountPubKey: newPublicKey,
          variableInTaskName,
          desktopVariableId,
        })
    );

    await Promise.all(pairingPromises);
  }
};

const startNewTask = async (taskPublicKey: string) => {
  const newTaskInfo = await getTaskInfo({} as Event, {
    taskAccountPubKey: taskPublicKey,
  });

  const newTaskIsPrivate = newTaskInfo.isActive && !newTaskInfo.isWhitelisted;

  if (newTaskIsPrivate) {
    await setRunnedPrivateTask({} as Event, {
      runnedPrivateTask: taskPublicKey,
    });
  }

  await startTask({} as Event, {
    taskAccountPubKey: taskPublicKey,
    isPrivate: newTaskIsPrivate,
  });
};

const signPayload = async (payload: string, keypair: Keypair) => {
  const msg = new TextEncoder().encode(JSON.stringify(payload));
  const signedMessage = nacl.sign(msg, keypair.secretKey);
  const signData = bs58.encode(
    Buffer.from(
      signedMessage.buffer,
      signedMessage.byteOffset,
      signedMessage.byteLength
    )
  );
  return signData;
};

const redeemTokensInNewNetwork = async () => {
  const mainSystemAccountKeypair = await getMainSystemAccountKeypair();
  const stakingSystemAccountKeypair = await getStakingAccountKeypair();

  const postData = async (publicKey: string, signedMessage: string) => {
    return new Promise((resolve, reject) => {
      const data = JSON.stringify({
        publicKey,
        signedMessage,
      });

      console.log({ body: data });
      const options = {
        hostname: 'faucet-api.koii.network',
        path: '/api/claimStakedAmounts',
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Content-Length': data.length,
        },
      };

      const req = https.request(options, (res) => {
        let responseData = '';
        res.on('data', (chunk) => {
          responseData += chunk;
        });

        res.on('end', () => {
          try {
            resolve(JSON.parse(responseData));
          } catch (e) {
            reject(e);
          }
        });
      });

      req.on('error', (error) => {
        reject(error.message);
      });

      req.write(data);
      req.end();
    });
  };

  const stakingAccountSignature = await signPayload(
    mainSystemAccountKeypair.publicKey.toBase58(),
    stakingSystemAccountKeypair
  );
  const response = await postData(
    stakingSystemAccountKeypair.publicKey.toBase58(),
    stakingAccountSignature
  );

  console.log({ response });
};
