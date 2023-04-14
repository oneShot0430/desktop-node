// import { Task } from 'main/type';
import { ChildProcess } from 'child_process';

import {
  runTimers,
  ITaskNodeBase,
  IRunningTasks,
} from '@koii-network/task-node';
import { ErrorType, Task } from 'models';
import { throwDetailedError } from 'utils';

import fetchAllTasks from '../controllers/fetchAlltasks';
import { namespaceInstance } from '../node/helpers/Namespace';

export class KoiiTaskService {
  private tasks: Task[] = [];

  public STARTED_TASKS: IRunningTasks<ITaskNodeBase> = {};

  constructor() {
    /**
     * 1. fetch all tasks from db
     */
    this.initializeTaskNode();

    this.watchTasks();
  }

  async initializeTaskNode() {
    this.tasks = await fetchAllTasks({} as Event);
    await this.getTasksStateFromDb();
  }

  async runTimers() {
    const selectedTasks = this.getRunningTasks().map((task) => ({
      task_id: task.publicKey,
      ...task.data.raw,
    }));

    await runTimers({
      selectedTasks,
      runningTasks: this.STARTED_TASKS,
      tasksCurrentRounds: Array(selectedTasks.length).fill(0),
    });
  }

  getTaskByPublicKey(publicKey: string): Task | undefined {
    return this.tasks.find((task) => {
      return task.publicKey === publicKey;
    });
  }

  /**
   * @dev: these are tasks which are running, but of Task type, which means,
   * they have no namespace, and are not running in a child process.
   */
  getRunningTasks(): Task[] {
    return this.tasks.length ? this.tasks.filter((e) => e.data.isRunning) : [];
  }

  /**
   * @dev : these are tasks which are running, and are of type IRunningTask,
   */
  getStartedTasks() {
    return this.STARTED_TASKS;
  }

  getAllTasks(): Task[] {
    return this.tasks.length ? this.tasks : [];
  }

  private async watchTasks() {
    setInterval(() => {
      // eslint-disable-next-line promise/catch-or-return
      fetchAllTasks({} as Event).then((res: Task[]) => {
        this.tasks = res;
        this.getTasksStateFromDb();
      });
    }, 60000);
  }

  async taskStarted(
    taskAccountPubKey: string,
    namespace: any,
    childTaskProcess: ChildProcess,
    expressAppPort: number,
    secret: string
  ): Promise<void> {
    this.tasks.map((task) => {
      if (task.publicKey === taskAccountPubKey) {
        task.data.isRunning = true;
        this.STARTED_TASKS[taskAccountPubKey] = {
          namespace,
          child: childTaskProcess,
          expressAppPort,
          secret,
        };
      }
      return task;
    });

    this.syncDb().then(() => {
      this.runTimers();
    });
  }

  private async syncDb() {
    const runningTasks: Array<string> = [];
    this.tasks.forEach((e) => {
      if (e.data.isRunning) runningTasks.push(e.publicKey);
    });
    await namespaceInstance.storeSet(
      'runningTasks',
      JSON.stringify(runningTasks)
    );
  }

  taskStopped(taskAccountPubKey: string) {
    this.tasks.map((task) => {
      if (task.publicKey === taskAccountPubKey) {
        task.data.isRunning = false;
        if (!this.STARTED_TASKS[taskAccountPubKey])
          return throwDetailedError({
            detailed: 'No such task is running',
            type: ErrorType.NO_RUNNING_TASK,
          });

        this.STARTED_TASKS[taskAccountPubKey].child.kill();
        delete this.STARTED_TASKS[taskAccountPubKey];
      }
      return task;
    });
    this.syncDb().then(() => {
      this.runTimers();
    });
  }

  private async getTasksStateFromDb() {
    const runningTasksStr: string = (await namespaceInstance.storeGet(
      'runningTasks'
    )) as string;
    const runningTasks: Array<string> = runningTasksStr
      ? (JSON.parse(runningTasksStr) as Array<string>)
      : [];

    this.tasks.map((task) => {
      if (runningTasks.includes(task.publicKey)) {
        task.data.isRunning = true;
        console.log('Set task running....');
      }
      return task;
    });
  }
}
