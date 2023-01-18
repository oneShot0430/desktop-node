import startTask from 'main/controllers/startTask';
import errorHandler from 'main/errorHandler';
import koiiTasks from 'services/koiiTasks';

const executeTasks = async (): Promise<any> => {
  const executableTasks = koiiTasks.getRunningTasks();

  console.log('EXECUTABLE TASKS', executableTasks);
  const taskSrcProms = executableTasks.map(async (task) => {
    await startTask(null, { taskAccountPubKey: task.publicKey });
  });
};

export default errorHandler(executeTasks, 'Execute tasks error');
