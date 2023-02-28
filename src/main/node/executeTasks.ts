import startTask from '../controllers/startTask';
import errorHandler from '../errorHandler';
import koiiTasks from '../services/koiiTasks';

const executeTasks = async (): Promise<any> => {
  const executableTasks = koiiTasks.getRunningTasks();

  console.log('EXECUTABLE TASKS', executableTasks);
  const taskSrcProms = executableTasks.map(async (task) => {
    await startTask({} as Event, { taskAccountPubKey: task.publicKey });
  });
};

export default errorHandler(executeTasks, 'Execute tasks error');
