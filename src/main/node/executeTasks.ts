import errorHandler from 'main/errorHandler';

const executeTasks = async (executableTasks: any[]): Promise<any> => {
  await Promise.all(executableTasks.map((task) => task.setup()));
  await Promise.all(
    executableTasks.map((task) => {
      task.execute();
    })
  );
};

export default errorHandler(executeTasks, 'Execute tasks error');
