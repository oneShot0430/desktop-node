import startTask from '../controllers/startTask';
import koiiTasks from '../services/koiiTasks';

const executeTasks = async (): Promise<void> => {
  const executableTasks = koiiTasks.getRunningTasks();

  const promises = executableTasks.map(async (task) => {
    return startTask({} as Event, { taskAccountPubKey: task.publicKey });
  });

  await Promise.all(promises);
  // run timers after tasks execution
  koiiTasks.runTimers();
};

export default executeTasks;
