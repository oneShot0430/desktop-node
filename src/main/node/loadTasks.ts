import * as fsSync from 'fs';

import { Keypair } from '@_koi/web3.js';
import Arweave from 'arweave';
import axios from 'axios';
import { Express } from 'express';

import config from 'config';
import errorHandler from 'main/errorHandler';
import koiiTasks from 'services/koiiTasks';
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

  const selectedTasks = koiiTasks.getRunningTasks();
  const taskSrcProms = selectedTasks.map((task) =>
    axios.get(`${config.node.GATEWAY_URL}/${task.data.taskAuditProgram}`),
  );

  const taskSrcs = (await Promise.all(taskSrcProms)).map(
    (res: any) => res.data || res,
  );
  return taskSrcs.map((src, i) =>
    loadTaskSource(
      src,
      new Namespace(
        selectedTasks[i].publicKey,
        expressApp,
        OPERATION_MODE,
        mainSystemAccount,
        {
          task_id: selectedTasks[i].publicKey,
          task_name: selectedTasks[i].data.taskName,
          task_manager: selectedTasks[i].data.taskManager,
          task_audit_program: selectedTasks[i].data.taskAuditProgram,
          stake_pot_account: selectedTasks[i].data.stakePotAccount,
          bounty_amount_per_round: selectedTasks[i].data.bountyAmountPerRound,

        }
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
