import fs from 'fs';

import * as dotenv from 'dotenv';

dotenv.config();
import { namespaceInstance } from 'main/node/helpers/Namespace';
import { DetailedError, ErrorType } from 'utils';

import executeTasks from './executeTasks';
import { getAppDataPath } from './helpers/getAppDataPath';
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
    let activeAccount;
    try {
      activeAccount = await namespaceInstance.storeGet('ACTIVE_ACCOUNT');
    } catch (e) {
      throw new DetailedError({
        detailed: e,
        summary: 'Select an account.',
        type: ErrorType.NO_ACTIVE_ACCOUNT,
      });
    }
    const mainWalletfilePath =
      getAppDataPath() + `/wallets/${activeAccount}_mainSystemWallet.json`;
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
