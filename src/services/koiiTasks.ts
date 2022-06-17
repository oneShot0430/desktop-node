// import { Task } from 'main/type';
import fetchAllTasks from '../main/controllers/fetchAlltasks';
import { Namespace, namespaceInstance } from '../main/node/helpers/Namespace';
import { Task, TaskData } from '../main/type/TaskData';

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

  getTaskByPublicKey(publicKey: string): any {
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

  async taskStarted(publicKey: string): Promise<void> {
    this.tasks.map((task) => {
      if (task.publicKey == publicKey) {
        task.data.isRunning = true;
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
    namespaceInstance.redisSet('runningTasks', JSON.stringify(runningTasks));
    return;
  }
  taskStopped(publicKey: string) {
    this.tasks.map((task) => {
      if (task.publicKey == publicKey) {
        task.data.isRunning = false;
      }
      return task;
    });
    // task.data.isRunning = true;
    this.syncRedis();
  }

  private async getTasksStateFromRedis() {
    const runningTasksStr: string = await namespaceInstance.redisGet(
      'runningTasks'
    );
    const runningTasks: Array<string> = runningTasksStr
      ? JSON.parse(runningTasksStr)
      : [];
    console.log({ runningTasksStr });
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
