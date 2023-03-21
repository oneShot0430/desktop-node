// import { Task } from 'main/type';
import { ChildProcess } from 'child_process';

import { ErrorType, Task } from 'models';
import { throwDetailedError } from 'utils';

import fetchAllTasks from '../controllers/fetchAlltasks';
import { namespaceInstance } from '../node/helpers/Namespace';
import { IRunningTasks } from '../type/TaskData';

class KoiiTasks {
  private tasks: Task[] = [];

  public RUNNING_TASKS: IRunningTasks = {};
  // private addedTasks: AddedTask[]

  constructor() {
    // eslint-disable-next-line promise/catch-or-return,
    fetchAllTasks({} as Event).then((res: Task[]) => {
      this.tasks = res;
      this.getTasksStateFromRedis();
    });
    this.watchTasks();
  }

  getTaskByPublicKey(publicKey: string): Task | undefined {
    return this.tasks.find((task) => {
      return task.publicKey === publicKey;
    });
  }

  getRunningTasks(): Task[] {
    return this.tasks.length ? this.tasks.filter((e) => e.data.isRunning) : [];
  }

  getAllTasks(): Task[] {
    return this.tasks.length ? this.tasks : [];
  }

  private async watchTasks() {
    setInterval(() => {
      // eslint-disable-next-line promise/catch-or-return
      fetchAllTasks({} as Event).then((res: Task[]) => {
        this.tasks = res;
        this.getTasksStateFromRedis();
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
        this.RUNNING_TASKS[taskAccountPubKey] = {
          namespace,
          child: childTaskProcess,
          expressAppPort,
          secret,
        };
      }
      return task;
    });
    // task.data.isRunning = true;
    this.syncRedis();
  }

  private async syncRedis() {
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
        if (!this.RUNNING_TASKS[taskAccountPubKey])
          return throwDetailedError({
            detailed: 'No such task is running',
            type: ErrorType.NO_RUNNING_TASK,
          });

        this.RUNNING_TASKS[taskAccountPubKey].child.kill();
        delete this.RUNNING_TASKS[taskAccountPubKey];
      }
      return task;
    });
    // task.data.isRunning = true;
    this.syncRedis();
  }

  private async getTasksStateFromRedis() {
    const runningTasksStr: string = (await namespaceInstance.storeGet(
      'runningTasks'
    )) as string;
    const runningTasks: Array<string> = runningTasksStr
      ? (JSON.parse(runningTasksStr) as Array<string>)
      : [];
    console.log({ runningTasks });
    this.tasks.map((task) => {
      if (runningTasks.includes(task.publicKey)) {
        task.data.isRunning = true;
        console.log('Set task running....');
      }
      return task;
    });
  }
}
export default new KoiiTasks();
