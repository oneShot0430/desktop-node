import { Event } from 'electron';
import * as fsSync from 'fs';

import { Keypair } from '@_koi/web3.js';
import * as web3 from '@_koi/web3.js';
import Arweave from 'arweave';
import axios from 'axios';
import * as base64 from 'base-64';
import * as bodyParser from 'body-parser';
import * as bs58 from 'bs58';
import * as dotenv from 'dotenv';
import * as cron from 'node-cron';
import * as smartweave from 'smartweave';
import * as nacl from 'tweetnacl';

import config from 'config';
import { Namespace, namespaceInstance } from 'main/node/helpers/Namespace';
import koiiTasks from 'services/koiiTasks';

import mainErrorHandler from '../../utils/mainErrorHandler';
import initExpressApp from '../node/initExpressApp';

import getTaskInfo from './getTaskInfo';

// eslint-disable-next-line
const bufferlayout = require('buffer-layout')

type StartTaskPayload = {
  taskAccountPubKey: string;
};
const OPERATION_MODE = 'service';

const startTask = async (event: Event, payload: StartTaskPayload) => {
  const { taskAccountPubKey } = payload;
  if (!(await namespaceInstance.redisGet('WALLET_LOCATION'))) {
    throw Error('WALLET_LOCATION not specified');
  }
  const mainSystemAccount = Keypair.fromSecretKey(
    Uint8Array.from(
      JSON.parse(
        fsSync.readFileSync(
          await namespaceInstance.redisGet('WALLET_LOCATION'),
          'utf-8'
        )
      )
    )
  );

  const taskInfo = koiiTasks.getTaskByPublicKey(taskAccountPubKey);
  console.log('ZZZ', taskInfo);
  const expressApp = await initExpressApp();

  try {
    // taskInfo.data.task_audit_program
    const url = `${
      config.node.GATEWAY_URL
    }/${'J1z1YsAPJA4kFzG1YrWEYQjZNdbPigm3Ev5rtpPSyug'}`;
    const { data: src } = await axios.get(url);
    console.log('AAAAZXXXCXZCVCXVXCCCXX', taskInfo);
    console.log(
      'AAAAZXXXCXZCVCXVXCCCXXzz',
      mainSystemAccount.publicKey.toBase58()
    );

    const taskSrc = loadTaskSource(
      src,
      new Namespace(
        taskAccountPubKey,
        expressApp,
        OPERATION_MODE,
        mainSystemAccount,
        {
          task_id: taskInfo.publicKey,
          ...taskInfo.data,
        }
      )
    );
    console.log('AAAZZ');
    await koiiTasks.taskStarted(taskAccountPubKey);
    console.log('SETTING UP TASK');
    await taskSrc.setup();
    console.log('STARTING EXECUTING TASK');
    taskSrc.execute();
  } catch (err) {
    console.error(err);
    throw new Error(err);
  }
};
const loadTaskSource = (src: string, namespace: Namespace) => {
  console.log('__dirname', __dirname);
  console.log('AAAAAA', namespace.taskData);
  const loadedTask = new Function(`
      const [namespace, require] = arguments;
      ${src};
      return {setup, execute};
    `);

  /*
          const log_file = fs.createWriteStream(__dirname + '/debug.log', {flags: 'w'});
      let console = {
        log: (d) =>{
          log_file.write(util.format(d) + '\n');
        },
      };
    */
  const _require = (module: string) => {
    switch (module) {
      case 'arweave':
        return Arweave;
      case 'axios':
        return axios;
      case '@_koi/web3.js':
        return web3;
      case 'crypto':
        return () => {
          /* */
        };
      case 'tweetnacl':
        return nacl;
      case 'bs58':
        return bs58;
      case 'node-cron':
        return cron;
      case 'bodyParser':
        return bodyParser;
      case 'bufferlayout':
        return bufferlayout;
      case 'dotenv':
        return dotenv;
      case 'smartweave':
        return smartweave;
      case 'base64':
        return base64;
    }
  };

  // TODO: Instead of passing require change to _require and allow only selected node modules
  return loadedTask(namespace, _require);
};

export default mainErrorHandler(startTask);
