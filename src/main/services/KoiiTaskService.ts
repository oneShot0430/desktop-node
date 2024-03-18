/* eslint-disable class-methods-use-this */
import { ChildProcess } from 'child_process';
import fs from 'fs';

import { PublicKey } from '@_koi/web3.js';
import {
  getTaskState,
  IRunningTasks,
  ITaskNodeBase,
  runTimers,
  updateRewardsQueue,
  initialPropagation,
  runPeriodic,
} from '@koii-network/task-node';
import getAverageSlotTime from 'main/controllers/getAverageSlotTime';
import getCurrentSlot from 'main/controllers/getCurrentSlot';
import { getNetworkUrl } from 'main/controllers/getNetworkUrl';
import getStakingAccountPubKey from 'main/controllers/getStakingAccountPubKey';
import { getTaskMetadata } from 'main/controllers/getTaskMetadata';
import { getMainSystemAccountKeypair } from 'main/node/helpers';
import { store } from 'main/node/helpers/k2NetworkUrl';
import { DetailedError, ErrorType, RawTaskData, TaskMetadata } from 'models';
import { throwDetailedError, getProgramAccountFilter } from 'utils';

import config from '../../config';
import { TASK_CONTRACT_ID, ATTENTION_TASK_ID } from '../../config/node';
import { SystemDbKeys } from '../../config/systemDbKeys';
import { getAppDataPath } from '../node/helpers/getAppDataPath';
import { namespaceInstance } from '../node/helpers/Namespace';

import sdk from './sdk';
import { getTasksFromCache, saveTasksToCache } from './tasks-cache-utils';

interface Submission {
  submission_value: string;
  slot: number;
  round: number;
}

type SubmissionsRecord = Record<string, Record<string, Submission>>;

function getLatestSubmission(
  publicKey: string,
  submissions: SubmissionsRecord
): Submission | undefined {
  let latestSubmission: Submission | undefined;
  // eslint-disable-next-line guard-for-in
  for (const round in submissions) {
    const submission = submissions[round][publicKey];
    if (
      submission &&
      (!latestSubmission || submission.round > latestSubmission.round)
    ) {
      latestSubmission = submission;
    }
  }
  return latestSubmission;
}

export class KoiiTaskService {
  public RUNNING_TASKS: IRunningTasks<ITaskNodeBase> = {};

  public allTaskPubkeys: string[] = [];

  public timerForRewards = 0;

  private startedTasksData:
    | Omit<RawTaskData, 'is_running'>[]
    | null
    | undefined = [];

  private taskMetadata: any = {};

  private submissionCheckIntervals: Record<string, NodeJS.Timeout> = {};

  private isInitialized = false;

  public nodePropagationInterval: NodeJS.Timeout | null = null;

  /**
   * @dev: this functions is preparing the Desktop Node to work in a few crucial steps:
   * 1. Fetch all tasks from the Task program
   * 2. Get the state of the tasks from the database
   * 3. Watch for changes in the tasks
   */
  async initializeTasks() {
    await this.fetchAllTaskIds();
    // await this.synchroniseFileSystemTasksWithDB();
    await this.fetchStartedTaskData();

    this.watchTasks();
  }

  async runTimers() {
    /**
     * @todo: get it from the database
     */
    const startedTasks = this.startedTasksData?.filter((task) => {
      return !!this.RUNNING_TASKS[task.task_id];
    });

    if (!startedTasks) {
      return;
    }

    runTimers({
      selectedTasks: startedTasks,
      runningTasks: this.RUNNING_TASKS,
      setTimerForRewards: this.setTimerForRewards,
      networkURL: getNetworkUrl(),
    });
  }

  public stopSubmissionCheck(taskAccountPubKey: string): void {
    if (this.submissionCheckIntervals[taskAccountPubKey]) {
      clearInterval(this.submissionCheckIntervals[taskAccountPubKey]);
      delete this.submissionCheckIntervals[taskAccountPubKey]; // Remove the interval ID from the tracking object
    }
  }

  public async getTaskState(taskAccountPubKey: string) {
    const partialRawTaskData: Omit<RawTaskData, 'task_id'> = await getTaskState(
      sdk.k2Connection,
      new PublicKey(taskAccountPubKey)
    );

    if (!partialRawTaskData || !partialRawTaskData.task_name) {
      throw new Error('Task data not found');
    }

    return {
      ...partialRawTaskData,
      task_id: taskAccountPubKey,
    };
  }

  private async checkTaskSubmission(task: RawTaskData) {
    const pubKey = await getStakingAccountPubKey();
    const lastSubmission = getLatestSubmission(pubKey, task.submissions);

    const currentSlot = await getCurrentSlot();
    const currentRound = Math.floor(
      (currentSlot - task.starting_slot) / task.round_time
    );

    const runningTask = this.RUNNING_TASKS[task.task_id];

    const stopSubmissionCheckAndRetry = () => {
      this.stopSubmissionCheck(task.task_id);
      runningTask.child.kill('SIGTERM');
      // TO DO: find why sometimes kill() doesn't trigger the exit event and we have to emit it manually
      runningTask.child.emit('exit', 0, null);
    };

    if (!lastSubmission?.round) {
      if (runningTask) {
        stopSubmissionCheckAndRetry();
      }
      return;
    }

    if (currentRound - lastSubmission.round > 3) {
      if (runningTask) {
        stopSubmissionCheckAndRetry();
      }
    }
  }

  private watchTasks() {
    if (this.isInitialized) return;
    this.isInitialized = true;
    setInterval(() => {
      try {
        this.fetchAllTaskIds();
        this.fetchStartedTaskData().then(() => {
          // this.checkTaskSubmissions();
          console.log('check task submissions');
        });
      } catch (e) {
        console.error(e);
      }
    }, 60000);
  }

  async getStartedTasks(): Promise<RawTaskData[]> {
    if (!this.startedTasksData) {
      // Try to load from cache if the data has not been fetched
      const cachedData = await getTasksFromCache();
      if (cachedData) {
        this.startedTasksData = cachedData;
      } else {
        throw new Error('Tasks not fetched properly and no cache available');
      }
    }

    return this.startedTasksData.map((task) => ({
      ...task,
      is_running: Boolean(this.RUNNING_TASKS[task.task_id]),
    }));
  }

  async startTask(
    taskAccountPubKey: string,
    namespace: ITaskNodeBase,
    childTaskProcess: ChildProcess,
    expressAppPort: number,
    secret: string
  ): Promise<void> {
    this.RUNNING_TASKS[taskAccountPubKey] = {
      namespace,
      child: childTaskProcess,
      expressAppPort,
      secret,
    };

    await this.addRunningTaskPubKey(taskAccountPubKey);
    await this.fetchStartedTaskData();
    await this.runTimers();

    try {
      if (this.nodePropagationInterval) {
        clearInterval(this.nodePropagationInterval);
      }
      const runningTasks = (await this.getStartedTasks()).filter((task) => {
        return !!this.RUNNING_TASKS[task.task_id];
      });
      const curr_subDomain = await namespaceInstance.storeGet('subdomain');
      const mainSystemAccount = await getMainSystemAccountKeypair();
      initialPropagation(
        runningTasks,
        ATTENTION_TASK_ID,
        namespaceInstance,
        mainSystemAccount,
        `https://${curr_subDomain}`,
        true
      ).then(() => {
        this.nodePropagationInterval = setInterval(
          () =>
            runPeriodic(
              runningTasks,
              namespaceInstance,
              mainSystemAccount,
              `https://${curr_subDomain}`,
              true
            ),
          300000
        );
      });
    } catch (error: any) {
      console.error(error.message);
    }

    const taskRawData = this.startedTasksData?.find(
      (task) => task.task_id === taskAccountPubKey
    );

    if (!taskRawData) {
      return;
    }
    const averageSlotTime = await getAverageSlotTime();
    const roundTime = taskRawData.round_time * averageSlotTime;

    this.submissionCheckIntervals[taskAccountPubKey] = setInterval(() => {
      const taskRawData = this.startedTasksData?.find(
        (task) => task.task_id === taskAccountPubKey
      );
      if (taskRawData) this.checkTaskSubmission(taskRawData);
    }, 3.5 * roundTime);
  }

  async setTimerForRewards(value: number) {
    store.set('timeToNextRewardAsSlots', value);
  }

  async updateRewardsQueue() {
    await updateRewardsQueue(this.setTimerForRewards, sdk.k2Connection);
  }

  async stopTaskOnAppQuit() {
    const runningTasks = Object.keys(this.RUNNING_TASKS) || [];
    runningTasks.forEach((taskPubKey) => {
      this.RUNNING_TASKS[taskPubKey].child.kill('SIGTERM');
    });
  }

  async stopTask(
    taskAccountPubKey: string,
    skipRemoveFromRunningTasks?: boolean
  ) {
    if (!this.RUNNING_TASKS[taskAccountPubKey]) {
      return throwDetailedError({
        detailed: 'No such task is running',
        type: ErrorType.NO_RUNNING_TASK,
      });
    }

    this.RUNNING_TASKS[taskAccountPubKey].child.kill('SIGTERM');
    // TO DO: find why sometimes kill() doesn't trigger the exit event and we have to emit it manually
    this.RUNNING_TASKS[taskAccountPubKey].child.emit('exit', null, null);

    delete this.RUNNING_TASKS[taskAccountPubKey];

    if (!skipRemoveFromRunningTasks) {
      await this.removeRunningTaskPubKey(taskAccountPubKey);
    }

    await this.runTimers();

    // const startedTasks = this.startedTasksData?.filter((task) => {
    //   return !!this.RUNNING_TASKS[task.task_id];
    // });
    // const promiseArr = startedTasks?.map(async (e) => {
    //   return {
    //     ...e,
    //     fetchedMetadata: await this.getTaskMetadataUtil(e.task_metadata),
    //   };
    // });
    // const tasksArrWithMetadata = await Promise.allSettled(promiseArr);
    // const isOrcaTasksRunning =
    //   tasksArrWithMetadata.filter(
    //     (e) =>
    //       e.status === 'fulfilled' &&
    //       e.value.fetchedMetadata.requirementsTags.find(
    //         (e) => e.type === 'ADDON' && e.value === 'ORCA_TASK'
    //       )
    //   ).length > 0;
    // if (!isOrcaTasksRunning) {
    //   try {
    //     await stopOrcaVM();
    //   } catch (e) {
    //     console.error(e);
    //   }
    // }
    try {
      if (this.nodePropagationInterval) {
        clearInterval(this.nodePropagationInterval);
      }
      const runningTasks = (await this.getStartedTasks()).filter((task) => {
        return !!this.RUNNING_TASKS[task.task_id];
      });
      const mainSystemAccount = await getMainSystemAccountKeypair();
      const curr_subDomain = await namespaceInstance.storeGet('subdomain');
      console.log('curr_subDomain', curr_subDomain);
      initialPropagation(
        runningTasks,
        ATTENTION_TASK_ID,
        namespaceInstance,
        mainSystemAccount,
        `https://${curr_subDomain}`,
        true
      ).then(() => {
        this.nodePropagationInterval = setInterval(
          () =>
            runPeriodic(
              runningTasks,
              namespaceInstance,
              mainSystemAccount,
              `https://${curr_subDomain}`,
              true
            ),
          300000
        );
      });
    } catch (error: any) {
      console.error(error.message);
    }
  }

  async fetchAllTaskIds() {
    try {
      const availableTasksIds = (
        await sdk.k2Connection.getProgramAccounts(
          new PublicKey(process.env.TASK_CONTRACT_ID || TASK_CONTRACT_ID),
          {
            dataSlice: {
              offset: 0,
              length: 0,
            },
            filters: [getProgramAccountFilter],
          }
        )
      ).map(({ pubkey }) => pubkey.toBase58());

      this.allTaskPubkeys = availableTasksIds;
    } catch (err) {
      console.error(err);
    }
  }

  public async addRunningTaskPubKey(pubkey: string) {
    const currentlyRunningTaskIds: Array<string> = Array.from(
      new Set([...(await this.getRunningTaskPubKeys()), pubkey])
    );
    await namespaceInstance.storeSet(
      SystemDbKeys.RunningTasks,
      JSON.stringify(currentlyRunningTaskIds)
    );
  }

  public async getIsTaskRunning(pubkey: string) {
    const isTaskRunning = !!this.RUNNING_TASKS[pubkey];
    return isTaskRunning;
  }

  /**
   * @dev store running tasks
   */
  private async removeRunningTaskPubKey(pubkey: string) {
    const currentlyRunningTaskIds: Array<string> =
      await this.getRunningTaskPubKeys();
    const isTaskRunning = currentlyRunningTaskIds.includes(pubkey);

    if (isTaskRunning) {
      const actualRunningTaskIds = currentlyRunningTaskIds.filter(
        (taskPubKey) => {
          return taskPubKey !== pubkey;
        }
      );

      await namespaceInstance.storeSet(
        SystemDbKeys.RunningTasks,
        JSON.stringify(actualRunningTaskIds)
      );
    } else {
      /**
       * @dev we cant throw error here, because it iwll interrupt the stopTask process
       */
      console.error(`Task ${pubkey} is not running`);
    }
  }

  async getRunningTaskPubKeys(): Promise<string[]> {
    const runningTasksStr: string | undefined =
      await namespaceInstance.storeGet(SystemDbKeys.RunningTasks);
    try {
      const startedTasks = await this.getStartedTasksPubKeys();
      const runningTasks = (
        runningTasksStr ? (JSON.parse(runningTasksStr) as Array<string>) : []
      ).filter((task) => startedTasks.includes(task));

      return runningTasks;
    } catch (e) {
      return [];
    }
  }

  async getStartedTasksPubKeys(): Promise<string[]> {
    const files = fs.readdirSync(`${getAppDataPath()}/namespace`, {
      withFileTypes: true,
    });

    const startedTasksPubKeys = files
      .filter((item) => item.isDirectory())
      /**
       * @dev we are using the name of the directory as the task pubkey
       */
      .map((item) => item.name);
    return startedTasksPubKeys;
  }

  removeTaskFromStartedTasks(taskPubKey: string) {
    // if is running, stop it
    if (this.RUNNING_TASKS[taskPubKey]) {
      this.RUNNING_TASKS[taskPubKey].child.kill();
      delete this.RUNNING_TASKS[taskPubKey];
    }

    // remove from started tasks data
    this.startedTasksData = this.startedTasksData?.filter(
      (task) => task.task_id !== taskPubKey
    );

    // remove from filesystem
    fs.rmdirSync(`${getAppDataPath()}/namespace/${taskPubKey}`, {
      recursive: true,
    });
  }

  async fetchDataBundleAndValidateIfTasks(
    pubkeys: string[]
  ): Promise<(RawTaskData | null)[]> {
    const multiAccountInfo = await sdk.k2Connection.getMultipleAccountsInfo(
      pubkeys.map((pubkey) => new PublicKey(pubkey))
    );

    return Promise.all(
      multiAccountInfo.map(async (accountInfo, index) => {
        if (!accountInfo || !accountInfo.data)
          return throwDetailedError({
            detailed: `Data with pubkey ${accountInfo} not found`,
            type: ErrorType.TASK_NOT_FOUND,
          });
        const taskData = await this.parseIfTask(accountInfo.data as Buffer);
        if (!taskData) return null;

        return { ...taskData, task_id: pubkeys[index] };
      })
    );
  }

  async parseIfTask(
    data: Buffer
  ): Promise<Omit<RawTaskData, 'task_id'> | null> {
    if (data.length < config.node.MINIMUM_ACCEPTED_LENGTH_TASK_CONTRACT) {
      return null;
    }

    let parsedData;
    try {
      parsedData = JSON.parse(data.toString()) as any;
    } catch (err) {
      return null;
    }
    if (!parsedData.task_name) {
      return null;
    }
    return parsedData as Omit<RawTaskData, 'task_id'>;
  }

  async fetchStartedTaskData() {
    const startedTasksPubKeys: Array<string> =
      await this.getStartedTasksPubKeys();

    if (startedTasksPubKeys.length === 0) {
      this.startedTasksData = [];
      return;
    }

    const promises = startedTasksPubKeys.map(async (pubkey) => {
      const existingState = this.startedTasksData?.find(
        (task) => task.task_id === pubkey
      );

      try {
        const taskData = await this.getTaskState(pubkey);

        if (!taskData && existingState) {
          return existingState;
        }

        return taskData;
      } catch (e) {
        const errorMessage = (e as { message: string }).message;
        console.error(errorMessage);
        const detailedError = JSON.parse(errorMessage) as DetailedError;

        if (detailedError.type === ErrorType.TASK_NOT_FOUND) {
          await this.removeRunningTaskPubKey(pubkey);
        }
        if (existingState) {
          return existingState;
        }
        throw e;
      }
    });

    const results = await Promise.allSettled(promises);

    const filteredResults = results.filter(
      (result) => result.status === 'fulfilled'
    ) as PromiseFulfilledResult<RawTaskData>[];

    const promisesData = filteredResults.map((result) => {
      return result.value;
    });

    if (promisesData.length === 0) {
      this.startedTasksData = null;
    } else {
      this.startedTasksData = promisesData;
      await saveTasksToCache(promisesData);
    }
  }

  async getTaskMetadataUtil(metadataCID: string): Promise<TaskMetadata> {
    if (this.taskMetadata[metadataCID]) {
      return this.taskMetadata[metadataCID];
    }
    const taskMetadata = await getTaskMetadata({} as Event, {
      metadataCID,
    });
    this.taskMetadata[metadataCID] = taskMetadata;
    return taskMetadata;
  }
}
