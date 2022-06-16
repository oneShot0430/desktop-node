import * as fsSync from 'fs';

import config from 'config';
import koiiState from 'services/koiiState';

// import * as dotenv from 'dotenv';
// dotenv.config();
import executeTasks from './executeTasks';
import { Namespace, namespaceInstance } from './helpers/Namespace';
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
  try {
    await namespaceInstance.loadRedisClient();
    if (await namespaceInstance.redisGet('WALLET_LOCATION')) {
      /* Init Express app */
      const expressApp = await initExpressApp();
      /* Load tasks */
      const executableTasks = await loadTasks(expressApp);
      /* Execute tasks */
      await executeTasks(executableTasks);
    }
  } catch (e) {
    console.error(e);
  }
};
