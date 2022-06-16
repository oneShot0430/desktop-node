import * as fsSync from 'fs';

import { Keypair } from '@_koi/web3.js';
import Arweave from 'arweave';
import axios from 'axios';
import { Express } from 'express';

import config from 'config';
import errorHandler from 'main/errorHandler';
import koiiState from 'services/koiiState';
import sdk from 'services/sdk';

import { Namespace, namespaceInstance } from './helpers/Namespace';

const OPERATION_MODE = 'service';
const loadTasks = async (expressApp: Express) => {
  if (!await namespaceInstance.redisGet('WALLET_LOCATION')) {
    throw Error('WALLET_LOCATION not specified');
  }
  const mainSystemAccount = Keypair.fromSecretKey(
    Uint8Array.from(
      JSON.parse(
        fsSync.readFileSync(
          await namespaceInstance.redisGet('WALLET_LOCATION'),
          'utf-8',
        ),
      ),
    ),
  );

  // Fetch all tasks => selectedTasks = koiiState.getActiveTasks()
  
  const selectedTasks: any = [];
  const taskSrcProms = selectedTasks.map((task: any) =>
    axios.get(`${config.node.GATEWAY_URL}/${task[2]}`),
  );

  const taskSrcs = (await Promise.all(taskSrcProms)).map(
    (res: any) => res.data || res,
  );
  return taskSrcs.map((src, i) =>
    loadTaskSource(
      src,
      new Namespace(
        selectedTasks[i][0],
        expressApp,
        OPERATION_MODE,
        mainSystemAccount,
        selectedTasks[i][3],
      ),
    ),
  );
};


const loadTaskSource = (src: string, namespace: Namespace) => {
  const loadedTask = new Function(`
    const [namespace, require] = arguments;
    ${src};
    return {setup, execute};
  `);

  const _require = (module: string) => {
    switch (module) {
      case 'arweave': return Arweave;
      case '@_koi/kohaku': return sdk.kohaku;
      case 'axios': return axios;
      case 'crypto': return () => {/* */ };
    }
  };

  // TODO: Instead of passing require change to _require and allow only selected node modules
  return loadedTask(
    namespace,
    require
  );
};

export default errorHandler(loadTasks, 'Load tasks error');
