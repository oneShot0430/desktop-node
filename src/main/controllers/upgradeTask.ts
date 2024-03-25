import { Event } from 'electron';

import { archiveTask } from './archiveTask';
import claimReward from './claimReward';
import delegateStake from './delegateStake';
import { getAllTimeRewardsByTask } from './getAllTimeRewardsByTask';
import { getIsTaskRunning } from './getIsTaskRunning';
import getStakingAccountPubKey from './getStakingAccountPubKey';
import { getTaskInfo } from './getTaskInfo';
import { getRunnedPrivateTasks, setRunnedPrivateTask } from './privateTasks';
import startTask from './startTask';
import stopTask from './stopTask';
import { storeAllTimeRewards } from './storeAllTimeRewards';
import { pairTaskVariable, getPairedTaskVariableData } from './taskVariables';
import withdrawStake from './withdrawStake';

const K2_MAX_FINALITY_DELAY = 5000;

interface UpgradeTaskParams {
  oldPublicKey: string;
  newPublicKey: string;
  newStake: number;
}

export const upgradeTask = async (
  _: Event,
  { oldPublicKey, newPublicKey, newStake }: UpgradeTaskParams
) => {
  await stopOldTask(oldPublicKey);

  await unstakeFromOldTask(oldPublicKey);

  await ensureTransactionFinality();

  await claimRewardsFromOldTask(oldPublicKey);

  await ensureTransactionFinality();

  await addUpAllTimeRewards(oldPublicKey, newPublicKey);

  await delegateStake({} as Event, {
    taskAccountPubKey: newPublicKey,
    stakeAmount: newStake,
  });

  await migrateTaskVariables({
    oldPublicKey,
    newPublicKey,
  });

  await startNewTask({
    oldPublicKey,
    newPublicKey,
  });

  setTimeout(() => {
    archiveTask({} as Event, { taskPubKey: oldPublicKey });
  }, 3500);
};

const addUpAllTimeRewards = async (
  oldPublicKey: string,
  newPublicKey: string
) => {
  const oldTaskAllTimeRewards = await getAllTimeRewardsByTask({} as Event, {
    taskId: oldPublicKey,
  });

  await storeAllTimeRewards({} as Event, {
    taskId: newPublicKey,
    newReward: oldTaskAllTimeRewards,
  });
};

const stopOldTask = async (taskPublicKey: string) => {
  const isTaskRunning = await getIsTaskRunning({} as Event, {
    taskPublicKey,
  });
  if (isTaskRunning) {
    console.log('UPGRADE TASK: stop old task');
    await stopTask({} as Event, { taskAccountPubKey: taskPublicKey });
    console.log('UPGRADE TASK: stopped old task');
  }
};

interface PublicKeys {
  oldPublicKey: string;
  newPublicKey: string;
}

const migrateTaskVariables = async ({
  oldPublicKey,
  newPublicKey,
}: PublicKeys) => {
  const oldTaskPairedTaskVariables = (
    await getPairedTaskVariableData({
      taskAccountPubKey: oldPublicKey,
    })
  )?.taskPairings;

  if (oldTaskPairedTaskVariables) {
    console.log(
      'UPGRADE TASK: migrating task variables from old task to new task'
    );
    const pairingPromises = Object.entries(oldTaskPairedTaskVariables).map(
      ([variableInTaskName, desktopVariableId]) =>
        pairTaskVariable({} as Event, {
          taskAccountPubKey: newPublicKey,
          variableInTaskName,
          desktopVariableId,
        })
    );

    await Promise.all(pairingPromises);
    console.log(
      'UPGRADE TASK: migrated task variables from old task to new task'
    );
  }
};

const unstakeFromOldTask = async (oldPubKey: string) => {
  const stakingAccountPubKey = await getStakingAccountPubKey();
  const taskInfo = await getTaskInfo({} as Event, {
    taskAccountPubKey: oldPubKey,
  });

  const hasStakeOnTask = taskInfo?.stakeList?.[stakingAccountPubKey] > 0;

  if (hasStakeOnTask) {
    console.log('UPGRADE TASK: unstaking from old task');
    await withdrawStake({} as Event, {
      taskAccountPubKey: oldPubKey,
    }); /* eslint-disable @cspell/spellchecker */
    console.log('UPGRADE TASK: unstaked from old task');
  }
};

const claimRewardsFromOldTask = async (oldPublicKey: string) => {
  const stakingAccount = await getStakingAccountPubKey();
  const oldTaskPendingRewards = (
    await getTaskInfo({} as Event, {
      taskAccountPubKey: oldPublicKey,
    })
  )?.availableBalances;

  const userPendingRewards = oldTaskPendingRewards?.[stakingAccount];

  if (userPendingRewards) {
    console.log('UPGRADE TASK: claiming rewards from old task');
    await claimReward({} as Event, { taskAccountPubKey: oldPublicKey });
    console.log('UPGRADE TASK: claimed rewards from old task');
  }
};

const startNewTask = async ({ oldPublicKey, newPublicKey }: PublicKeys) => {
  const newTaskInfo = await getTaskInfo({} as Event, {
    taskAccountPubKey: newPublicKey,
  });

  const privateTasks = await getRunnedPrivateTasks();
  const oldTaskIsPrivate = privateTasks?.includes(oldPublicKey);
  const newTaskIsPrivate = oldTaskIsPrivate && !newTaskInfo.isWhitelisted;

  if (newTaskIsPrivate) {
    await setRunnedPrivateTask({} as Event, {
      runnedPrivateTask: newPublicKey,
    });
  }

  console.log('UPGRADE TASK: starting new task');
  await startTask({} as Event, {
    taskAccountPubKey: newPublicKey,
    isPrivate: newTaskIsPrivate,
  });
  console.log('UPGRADE TASK: started new task');
};

const ensureTransactionFinality = async () =>
  new Promise((resolve) => {
    if (process.env.NODE_ENV !== 'test') {
      setTimeout(resolve, K2_MAX_FINALITY_DELAY);
    } else {
      resolve('Skipping delay in test environment');
    }
  });
