import * as dotenv from 'dotenv';

dotenv.config();
import executeTasks from './executeTasks';
import { namespaceInstance } from './helpers/Namespace';
import initExpressApp from './initExpressApp';
// import initKohaku from './initKohaku';
import loadTasks from './loadTasks';

// import restoreKohaku from './restoreKohaku';

export default async (): Promise<any> => {
  // if (!process.env.NODE_MODE) throw new Error('env not found');
  /* Connect Redis */
  // await connectRedis(
  //   config.node.REDIS.IP,
  //   config.node.REDIS.PORT
  // );

  try {
    // await namespaceInstance.storeSet(
    //   'WALLET_LOCATION',
    //   '{WALLET_PATH_HERE}'
    // );
    // await startTask(null, {
    //   taskAccountPubKey: 'dGeVfkp1BcLDK13gxoNz5cy4aMMKXVsvSjDAhyLpPCR',
    // });

    // setTimeout(() => {
    //   console.log("STOPPING TASK")
    //   stopTask(null, {
    //     taskAccountPubKey: 'dGeVfkp1BcLDK13gxoNz5cy4aMMKXVsvSjDAhyLpPCR',
    //   })
    // }, 60000)
    if (await namespaceInstance.storeGet('WALLET_LOCATION')) {
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
