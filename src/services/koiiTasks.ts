// import { Task } from 'main/type';
import fetchAllTasks from '../main/controllers/fetchAlltasks';
import { namespaceInstance } from '../main/node/helpers/Namespace';
import { Task } from '../main/type/TaskData';

class KoiiTasks {
  private tasks: Task[] = [];
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

  async taskStarted(publicKey: string, cronArray: any): Promise<void> {
    this.tasks.map((task) => {
      if (task.publicKey == publicKey) {
        task.data.isRunning = true;
        task.data.cronArray = cronArray;
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
    namespaceInstance.storeSet('runningTasks', JSON.stringify(runningTasks));
    return;
  }
  taskStopped(publicKey: string) {
    this.tasks.map((task) => {
      if (task.publicKey == publicKey) {
        task.data.isRunning = false;
        task.data.cronArray.map((e: any) => {
          try {
            e.stop();
          } catch (e) {
            console.error('ERROR in task stop:', e);
          }
        });
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
