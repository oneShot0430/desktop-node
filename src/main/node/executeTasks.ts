import startTask from '../controllers/startTask';
import koiiTasks from '../services/koiiTasks';

const executeTasks = async (): Promise<void> => {
  const executableTaskPubkeys = await koiiTasks.getRunningTaskPubKeys();
  console.log('STARTING TASKS: ', executableTaskPubkeys);

  const promises = executableTaskPubkeys.map((publicKey) => {
    return startTask({} as Event, { taskAccountPubKey: publicKey });
  });

  await Promise.all(promises);
};

export default executeTasks;
