// import { Task } from 'main/type';
import { ChildProcess } from 'child_process';

import { DetailedError, ErrorType } from 'utils';

import fetchAllTasks from '../main/controllers/fetchAlltasks';
import { namespaceInstance } from '../main/node/helpers/Namespace';
import { Task, IRunningTasks } from '../main/type/TaskData';

class KoiiTasks {
  private tasks: Task[] = [];
  public RUNNING_TASKS: IRunningTasks = {};
  // private addedTasks: AddedTask[]

  constructor() {
    fetchAllTasks().then((res: any) => {
      this.tasks = res;
      this.getTasksStateFromRedis();
    });
    this.watchTasks();
  }

  getTaskByPublicKey(publicKey: string): Task {
    const task: Task = this.tasks.find((task) => {
      return task.publicKey == publicKey;
    });
    return task;
  }

  getRunningTasks(): Task[] {
    return this.tasks.length ? this.tasks.filter((e) => e.data.isRunning) : [];
  }

  getAllTasks(): Task[] {
    return this.tasks.length ? this.tasks : [];
  }
  private async watchTasks() {
    setInterval(() => {
      fetchAllTasks().then((res: Task[]) => {
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
      if (task.publicKey == taskAccountPubKey) {
        task.data.isRunning = true;
        this.RUNNING_TASKS[taskAccountPubKey] = {
          namespace: namespace,
          child: childTaskProcess,
          expressAppPort: expressAppPort,
          secret: secret,
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
    return;
  }
  taskStopped(taskAccountPubKey: string) {
    this.tasks.map((task) => {
      if (task.publicKey == taskAccountPubKey) {
        task.data.isRunning = false;
        if (!this.RUNNING_TASKS[taskAccountPubKey])
          throw new DetailedError({
            detailed: 'No such task is running',
            summary: "All good here, that task isn't running right now.",
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
    const runningTasksStr: string = await namespaceInstance.storeGet(
      'runningTasks'
    );
    const runningTasks: Array<string> = runningTasksStr
      ? JSON.parse(runningTasksStr)
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
