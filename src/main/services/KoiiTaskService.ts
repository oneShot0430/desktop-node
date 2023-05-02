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
import { throwDetailedError } from 'utils';

import config from '../../config';
import { TASK_CONTRACT_ID } from '../../config/node';
import { SystemDbKeys } from '../../config/systemDbKeys';
import { getAppDataPath } from '../node/helpers/getAppDataPath';
import { namespaceInstance } from '../node/helpers/Namespace';

import sdk from './sdk';

export class KoiiTaskService {
  public STARTED_TASKS: IRunningTasks<ITaskNodeBase> = {};

  public allTaskPubkeys: string[] = [];

  public runningTasksData: RawTaskData[] = [];

  /**
   * @dev: this functions is preparing the Desktop Node to work in a few crucial steps:
   * 1. Fetch all tasks from the Task program
   * 2. Get the state of the tasks from the database
   * 3. Watch for changes in the tasks
   */
  async initializeTasks() {
    await this.fetchAllTaskIds();
    await this.synchroniseFileSystemTasksWithDB();
    await this.fetchRunningTaskData();

    this.watchTasks();
  }

  async runTimers() {
    const selectedTasks = this.runningTasksData;

    await runTimers({
      selectedTasks,
      runningTasks: this.STARTED_TASKS,
      tasksCurrentRounds: Array(selectedTasks.length).fill(0),
      tasksLastUpdatedSubmission: Array(selectedTasks.length).fill(0),
      tasksLastUpdatedAudit: Array(selectedTasks.length).fill(0),
      tasksLastUpdatedDistribution: Array(selectedTasks.length).fill(0),
      tasksLastUpdatedDistributionAudit: Array(selectedTasks.length).fill(0),
    });
  }

  private watchTasks() {
    setInterval(() => {
      this.fetchAllTaskIds();
      this.fetchRunningTaskData();
    }, 15000);
  }

  async taskStarted(
    taskAccountPubKey: string,
    namespace: any,
    childTaskProcess: ChildProcess,
    expressAppPort: number,
    secret: string
  ): Promise<void> {
    this.STARTED_TASKS[taskAccountPubKey] = {
      namespace,
      child: childTaskProcess,
      expressAppPort,
      secret,
    };

    await this.addNewRunningTaskPubKey(taskAccountPubKey);
    await this.fetchRunningTaskData();
    await this.runTimers();
  }

  async taskStopped(taskAccountPubKey: string) {
    if (!this.STARTED_TASKS[taskAccountPubKey]) {
      return throwDetailedError({
        detailed: 'No such task is running',
        type: ErrorType.NO_RUNNING_TASK,
      });
    }

    this.STARTED_TASKS[taskAccountPubKey].child.kill();
    delete this.STARTED_TASKS[taskAccountPubKey];

    await this.removeRunningTaskPubKey(taskAccountPubKey);
    await this.fetchRunningTaskData();
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
        }
      )
    )
      .map(({ pubkey }) => pubkey.toBase58())
      .filter((pubkey) => !pubkey.includes('stakepotaccount'));
    console.log(`Fetched ${this.allTaskPubkeys.length} Tasks Public Keys`);
  }

  private async addNewRunningTaskPubKey(pubkey: string) {
    const currentlyRunningTaskIds: Array<string> = Array.from(
      new Set([...(await this.getRunningTaskPubkeysFromDB()), pubkey])
    );
    await namespaceInstance.storeSet(
      SystemDbKeys.RunningTasks,
      JSON.stringify(currentlyRunningTaskIds)
    );
  }

  private async removeRunningTaskPubKey(pubkey: string) {
    const currentlyRunningTaskIds: Array<string> =
      await this.getRunningTaskPubkeysFromDB();

    const index = currentlyRunningTaskIds.indexOf(pubkey);

    if (index < 0) {
      return throwDetailedError({
        detailed: 'No such task is running',
        type: ErrorType.NO_RUNNING_TASK,
      });
    }

    const actualRunningTaskIds = currentlyRunningTaskIds.splice(index, 1);

    await namespaceInstance.storeSet(
      SystemDbKeys.RunningTasks,
      JSON.stringify(actualRunningTaskIds)
    );
  }

  async getRunningTaskPubkeysFromDB(): Promise<string[]> {
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

  async getRunningTaskPubkeysFromFileSystem(): Promise<string[]> {
    const files = fs.readdirSync(`${getAppDataPath()}/namespace`, {
      withFileTypes: true,
    });
    const directoriesInDirectory = files
      .filter((item) => item.isDirectory())
      .map((item) => item.name);
    return directoriesInDirectory; // directories are pubkey of loaded Tasks
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

  async synchroniseFileSystemTasksWithDB() {
    const runningTaskPubkeysFromFileSystem =
      await this.getRunningTaskPubkeysFromFileSystem();

    const runningTaskPubKeysFromDB = await this.getRunningTaskPubkeysFromDB();
    runningTaskPubkeysFromFileSystem.forEach((pubkey) => {
      if (!runningTaskPubKeysFromDB.includes(pubkey)) {
        this.addNewRunningTaskPubKey(pubkey);
      }
    });
  }

  async fetchRunningTaskData() {
    const currentlyRunningTaskIds: Array<string> =
      await this.getRunningTaskPubkeysFromDB();

    this.runningTasksData = (
      await Promise.all(
        currentlyRunningTaskIds.map(async (pubkey) => {
          const task = await this.fetchDataAndValidateIfTask(pubkey).catch(
            async (err) => {
              if (isString(err) && err.includes(ErrorType.TASK_NOT_FOUND)) {
                await this.removeRunningTaskPubKey(pubkey);
                return null;
              }
              return null;
            }
          );

          if (task && !task.is_active) {
            console.log(
              `DETECTED NOT ACTIVE TASK WITH ID ${pubkey} - DROPPING`
            );
            await this.removeRunningTaskPubKey(pubkey);
            return null;
          }

          return task;
        })
      )
    ).filter((e): e is RawTaskData => Boolean(e));
  }
}
