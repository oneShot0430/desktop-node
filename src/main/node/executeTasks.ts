import koiiTasks from '../../services/koiiTasks';
import startTask from '../controllers/startTask';
import errorHandler from '../errorHandler';

const executeTasks = async (): Promise<any> => {
  const executableTasks = koiiTasks.getRunningTasks();

  console.log('EXECUTABLE TASKS', executableTasks);
  const taskSrcProms = executableTasks.map(async (task) => {
    await startTask(null, { taskAccountPubKey: task.publicKey });
  });
};

export default errorHandler(executeTasks, 'Execute tasks error');
