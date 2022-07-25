import * as fsSync from 'fs';

import { Keypair } from '@_koi/web3.js';
import * as web3 from '@_koi/web3.js';
import Arweave from 'arweave';
import axios from 'axios';
import * as base64 from 'base-64';
import * as bodyParser from 'body-parser';
import * as bs58 from 'bs58';
import * as cheerio from 'cheerio';
import * as dotenv from 'dotenv';
import { Express } from 'express';
import * as cron from 'node-cron';
import * as puppeteer from 'puppeteer';
import * as smartweave from 'smartweave';
import * as nacl from 'tweetnacl';

import config from 'config';
import errorHandler from 'main/errorHandler';
import koiiTasks from 'services/koiiTasks';

import { Namespace } from './helpers/Namespace';

// eslint-disable-next-line
const bufferlayout = require('buffer-layout')

const OPERATION_MODE = 'service';
const loadTasks = async (expressApp: Express) => {
  const mainSystemAccount = Keypair.fromSecretKey(
    Uint8Array.from(
      JSON.parse(fsSync.readFileSync('mainSystemWallet.json', 'utf-8'))
    )
  );

  const selectedTasks = koiiTasks.getRunningTasks();
  const taskSrcProms = selectedTasks.map((task) => {
    return axios.get(
      `${config.node.GATEWAY_URL}/${task.data.taskAuditProgram}`
    );
  });

  const taskSrcs = (await Promise.allSettled(taskSrcProms))
    .filter((e) => e.status == 'fulfilled')
    .map((res: any) => res.value.data || null);
  return taskSrcs
    .filter((e) => e != null)
    .map((src, i) =>
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
        )
      )
    )
    .filter((e) => !!e);
};

const loadTaskSource = (src: string, namespace: Namespace) => {
  try {
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
        case 'cheerio':
          return cheerio;
        case 'puppeteer':
          return puppeteer;
      }
    };

    // TODO: Instead of passing require change to _require and allow only selected node modules
    return loadedTask(namespace, _require);
  } catch (err) {
    console.error('ERROR in LoadTask', err);
  }
};

export default errorHandler(loadTasks, 'Load tasks error');
