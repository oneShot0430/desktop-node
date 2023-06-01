/* eslint-disable class-methods-use-this */
import { ChildProcess } from 'child_process';
import fs from 'fs';

import { PublicKey } from '@_koi/web3.js';
import {
  IRunningTasks,
  ITaskNodeBase,
  runTimers,
} from '@koii-network/task-node';
import { isString } from 'lodash';
import { ErrorType, RawTaskData } from 'models';
import { throwDetailedError, getProgramAccountFilter } from 'utils';

import config from '../../config';
import { TASK_CONTRACT_ID } from '../../config/node';
import { SystemDbKeys } from '../../config/systemDbKeys';
import { getAppDataPath } from '../node/helpers/getAppDataPath';
import { namespaceInstance } from '../node/helpers/Namespace';

import sdk from './sdk';

export class KoiiTaskService {
  public RUNNING_TASKS: IRunningTasks<ITaskNodeBase> = {};

  public allTaskPubkeys: string[] = [];

  private startedTasksData: Omit<RawTaskData, 'is_running'>[] = [];

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
    const startedTasks = this.startedTasksData.filter((task) => {
      return !!this.RUNNING_TASKS[task.task_id];
    });

    runTimers({
      selectedTasks: startedTasks,
      runningTasks: this.RUNNING_TASKS,
      tasksCurrentRounds: Array(startedTasks.length).fill(0),
      tasksLastUpdatedSubmission: Array(startedTasks.length).fill(0),
      tasksLastUpdatedAudit: Array(startedTasks.length).fill(0),
      tasksLastUpdatedDistribution: Array(startedTasks.length).fill(0),
      tasksLastUpdatedDistributionAudit: Array(startedTasks.length).fill(0),
    });
  }

  private watchTasks() {
    setInterval(() => {
      this.fetchAllTaskIds();
      this.fetchStartedTaskData();
    }, 15000);
  }

  getStartedTasks(): RawTaskData[] {
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

    this.RUNNING_TASKS[taskAccountPubKey].child.kill();
    delete this.RUNNING_TASKS[taskAccountPubKey];

    if (!skipRemoveFromRunningTasks) {
      await this.removeRunningTaskPubKey(taskAccountPubKey);
    }

    await this.runTimers();
  }

  async fetchAllTaskIds() {
    this.allTaskPubkeys = (
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
    console.log(`Fetched ${this.allTaskPubkeys.length} Tasks Public Keys`);
  }

  private async addRunningTaskPubKey(pubkey: string) {
    const currentlyRunningTaskIds: Array<string> = Array.from(
      new Set([...(await this.getRunningTaskPubKeys()), pubkey])
    );
    await namespaceInstance.storeSet(
      SystemDbKeys.RunningTasks,
      JSON.stringify(currentlyRunningTaskIds)
    );
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
      return runningTasksStr
        ? (JSON.parse(runningTasksStr) as Array<string>)
        : [];
    } catch (e: any) {
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
    this.startedTasksData = this.startedTasksData.filter(
      (task) => task.task_id !== taskPubKey
    );

    // remove from filesystem
    fs.rmdirSync(`${getAppDataPath()}/namespace/${taskPubKey}`, {
      recursive: true,
    });
  }

  async fetchDataAndValidateIfTask(
    pubkey: string
  ): Promise<RawTaskData | null> {
    const accountInfo = await sdk.k2Connection.getAccountInfo(
      new PublicKey(pubkey)
    );

    if (!accountInfo || !accountInfo.data)
      return throwDetailedError({
        detailed: `Data with pubkey ${pubkey} not found`,
        type: ErrorType.TASK_NOT_FOUND,
      });

    const taskData = await this.parseIfTask(accountInfo.data);
    if (!taskData) return null;

    return { ...taskData, task_id: pubkey };
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

    this.startedTasksData = (
      await Promise.all(
        startedTasksPubKeys.map(async (pubkey) => {
          const task = await this.fetchDataAndValidateIfTask(pubkey).catch(
            async (err) => {
              if (isString(err) && err.includes(ErrorType.TASK_NOT_FOUND)) {
                await this.removeRunningTaskPubKey(pubkey);
                /**
                 * @todo: additionaly remove the task from filesystem
                 * removeTaskFromStartedTasks(pubkey);
                 * should be tested after task remove is implemented from ui
                 */
                return null;
              }
              return null;
            }
          );

          // TODO(Chris) we need to refine this flow
          // if (task && !task.is_active) {
          //   console.log(
          //     `DETECTED NOT ACTIVE TASK WITH ID ${pubkey} - DROPPING`
          //   );
          //   await this.removeRunningTaskPubKey(pubkey);
          //   /**
          //    * @todo: additionaly remove the task from filesystem
          //    * removeTaskFromStartedTasks(pubkey);
          //    * should be tested after task remove is implemented from ui
          //    */
          //   return null;
          // }

          return task;
        })
      )
    ).filter((e): e is RawTaskData => Boolean(e));
  }
}
