import config from 'config';
import koiiState from 'services/koiiState';

import executeTasks from './executeTasks';
import initExpressApp from './initExpressApp';
// import initKohaku from './initKohaku';
import loadTasks from './loadTasks';
// import restoreKohaku from './restoreKohaku';



export default async (): Promise<any> => {
  if (!process.env.NODE_MODE) throw new Error('env not found');
  /* Connect Redis */
  // await connectRedis(
  //   config.node.REDIS.IP,
  //   config.node.REDIS.PORT
  // );



  /* Init Express app */
  const expressApp = await initExpressApp();

  /* Load tasks */
  // TODO: get all tasks
  // const executableTasks = await loadTasks(expressApp);

  /* Execute tasks */
  // await executeTasks(executableTasks);
};
