import fs from 'fs';

import * as dotenv from 'dotenv';

dotenv.config();
import { namespaceInstance } from 'main/node/helpers/Namespace';

import executeTasks from './executeTasks';
import initExpressApp from './initExpressApp';
// import loadTasks from './loadTasks';

export default async (): Promise<any> => {
  // if (!process.env.NODE_MODE) throw new Error('env not found');
  /* Connect Redis */
  // await connectRedis(
  //   config.node.REDIS.IP,
  //   config.node.REDIS.PORT
  // );

  try {
    // await startTask(null, {
    //   taskAccountPubKey: 'dGeVfkp1BcLDK13gxoNz5cy4aMMKXVsvSjDAhyLpPCR',
    // });

    // setTimeout(() => {
    //   console.log("STOPPING TASK")
    //   stopTask(null, {
    //     taskAccountPubKey: 'dGeVfkp1BcLDK13gxoNz5cy4aMMKXVsvSjDAhyLpPCR',
    //   })
    // }, 60000)
    const activeAccount = await namespaceInstance.storeGet('ACTIVE_ACCOUNT');
    if (!activeAccount) {
      throw new Error('Please select a Active Account');
    }
    const mainWalletfilePath = `wallets/${activeAccount}_mainSystemWallet.json`;
    if (fs.existsSync(mainWalletfilePath)) {
      /* Init Express app */
      const expressApp = await initExpressApp();

      /* Loading and Executing last running tasks */
      console.log('Executing TASKS');
      await executeTasks();
    }
  } catch (e) {
    console.error('ERROR In TASK start', e);
  }
};
