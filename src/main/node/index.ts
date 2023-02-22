import fs from 'fs';

import * as dotenv from 'dotenv';

import { ErrorType } from '../../models';
import { throwDetailedError } from '../../utils';

import executeTasks from './executeTasks';
import { getAppDataPath } from './helpers/getAppDataPath';
import { namespaceInstance } from './helpers/Namespace';

dotenv.config();
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
      return throwDetailedError({
        detailed: 'Please select an active account',
        type: ErrorType.NO_ACTIVE_ACCOUNT,
      });
    }
    const mainWalletfilePath = `${getAppDataPath()}/wallets/${activeAccount}_mainSystemWallet.json`;
    if (fs.existsSync(mainWalletfilePath)) {
      /* Loading and Executing last running tasks */
      setTimeout(() => {
        console.log('Executing TASKS');
        executeTasks();
      }, 5000);
    }
  } catch (e: any) {
    console.error('ERROR In TASK start', e);
  }
};
