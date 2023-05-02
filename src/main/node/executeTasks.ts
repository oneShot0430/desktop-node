import startTask from '../controllers/startTask';
import koiiTasks from '../services/koiiTasks';

const executeTasks = async (): Promise<void> => {
  const executableTaskPubkeys = await koiiTasks.getRunningTaskPubkeysFromDB();
  console.log('STARTING TASKS: ', executableTaskPubkeys);

  const promises = executableTaskPubkeys.map((publicKey) => {
    return startTask({} as Event, { taskAccountPubKey: publicKey });
  });

  await Promise.all(promises);
  // run timers after tasks execution
  await koiiTasks.runTimers();
};

export default executeTasks;
