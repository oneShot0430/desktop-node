import * as fsSync from 'fs';

import * as dotenv from 'dotenv';

import config from 'config';
import startTask from 'main/controllers/startTask';
import koiiState from 'services/koiiState';

dotenv.config();
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
    await namespaceInstance.redisSet(
      'WALLET_LOCATION',
      '/home/ghazanfer/.config/solana/id.json'
    );
    // await startTask(null, {
    //   taskAccountPubKey: 'dGeVfkp1BcLDK13gxoNz5cy4aMMKXVsvSjDAhyLpPCR',
    // });

    if (await namespaceInstance.redisGet('WALLET_LOCATION')) {
      /* Init Express app */
      const expressApp = await initExpressApp();
      /* Load tasks */
      const executableTasks = await loadTasks(expressApp);
      console.log('LOADING TASKS COMPLETED');
      /* Execute tasks */
      await executeTasks(executableTasks);
    }
  } catch (e) {
    console.error('ERROR In TASK start', e);
  }
};
