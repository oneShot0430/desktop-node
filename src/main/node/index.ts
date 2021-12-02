import config from 'config';
import koiiState from 'services/koiiState';

import connectRedis from './connectRedis';
import executeTasks from './executeTasks';
import initExpressApp from './initExpressApp';
import initKohaku from './initKohaku';
import loadTasks from './loadTasks';
import restoreKohaku from './restoreKohaku';



export default async (): Promise<any> => {
  if (!process.env.NODE_MODE) throw new Error('env not found');
  /* Connect Redis */
  await connectRedis(
    config.node.REDIS.IP,
    config.node.REDIS.PORT
  );

  /* Restore koiiState from Redis */
  const hasCachedData = await restoreKohaku();

  /* Init kohaku */
  if (hasCachedData) {
    initKohaku();
  } else {
    await initKohaku();
  }

  /* Init Express app */
  const expressApp = await initExpressApp();

  /* Load tasks */
  const executableTasks = await loadTasks(expressApp);

  /* Execute tasks */
  await executeTasks(executableTasks);
};
