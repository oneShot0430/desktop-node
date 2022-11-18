import * as fs from 'fs';
import * as fsPromises from 'fs/promises';

import {
  Keypair,
  Connection,
  PublicKey,
  TransactionInstruction,
  Transaction,
  sendAndConfirmTransaction,
  SYSVAR_CLOCK_PUBKEY,
  SystemProgram,
  // LAMPORTS_PER_SOL,
  AccountInfo,
} from '@_koi/web3.js';
import axios from 'axios';
import bs58 from 'bs58';
import jwt from 'jsonwebtoken';
import nacl from 'tweetnacl';

import { ErrorType } from 'models';
import { DetailedError } from 'utils';

import { getAppDataPath } from './getAppDataPath';
import leveldbWrapper from './leveldb';

// eslint-disable-next-line
const BufferLayout = require('@solana/buffer-layout');
const DEFAULT_PROGRAM_ID = 'Koiitask22222222222222222222222222222222222';
const TRUSTED_SERVICE_URL = 'https://k2-tasknet.koii.live';
interface redisConfig {
  redis_ip?: string;
  redis_port?: number;
  redis_password?: string;
  username?: string;
}
interface TaskData {
  task_id?: string;
  task_name?: string;
  task_manager?: PublicKey;
  task_audit_program?: string;
  stake_pot_account?: PublicKey;
  bounty_amount_per_round?: number;
}
interface INode {
  data: {
    url: string | undefined;
    timestamp: number;
  };
  signature: string;
  owner: string;
  submitterPubkey: string;
  tasks: [string];
}
const BUNDLER_NODES = '/nodes';
const TASK_CONTRACT_ID: PublicKey = new PublicKey(
  'Koiitask22222222222222222222222222222222222'
);
const TASK_INSTRUCTION_LAYOUTS = Object.freeze({
  SubmitTask: {
    index: 1,
    layout: BufferLayout.struct([
      BufferLayout.u8('instruction'),
      BufferLayout.blob(512, 'submission'),
    ]),
  },
  Vote: {
    index: 3,
    layout: BufferLayout.struct([
      BufferLayout.u8('instruction'),
      BufferLayout.ns64('is_valid'),
    ]),
  },
  Stake: {
    index: 10,
    layout: BufferLayout.struct([
      BufferLayout.u8('instruction'),
      BufferLayout.ns64('stakeAmount'),
    ]),
  },
  ClaimReward: {
    index: 8,
    layout: BufferLayout.struct([BufferLayout.u8('instruction')]),
  },
});
// Singletons
/**
 * Namespace wrapper over APIs needed in Koii tasks
 */
class Namespace {
  /**
   * @param {*} taskTxId Tasks transaction ID to be used as the namespace name
   * @param {*} expressApp // Express app for configuration
   */
  taskTxId: string;
  app: any;
  redisClient?: any;
  taskData: TaskData;
  #mainSystemAccount: Keypair;
  mainSystemAccountPubKey: PublicKey;
  db: any;

  programId: PublicKey;
  taskAccountInfo: AccountInfo<Buffer> | null;
  submitterAccountKeyPair: Keypair;
  submitterPubkey: string;
  connection: Connection;
  taskStateInfoPublicKey: any;
  STAKE_POT_ACCOUNT: any;

  constructor(
    taskTxId: string,
    expressApp: any,
    operationMode: string,
    mainSystemAccount: Keypair | null,
    taskData: TaskData
  ) {
    this.taskTxId = taskTxId;
    this.app = expressApp;
    if (operationMode === 'service') {
      this.loadRedisClient();
    }
    // if (!mainSystemAccount) {
    //   if (!process.env.WALLET_LOCATION) {
    //     throw new Error('WALLET_LOCATION environment variable missing');
    //   }
    //   mainSystemAccount = Keypair.fromSecretKey(
    //     Uint8Array.from(
    //       JSON.parse(
    //         fs.readFileSync(process.env.WALLET_LOCATION + '', 'utf-8'),
    //       ),
    //     ),
    //   );
    // }
    // this.#mainSystemAccount = mainSystemAccount;
    // this.mainSystemAccountPubKey = mainSystemAccount.publicKey;

    this.taskData = taskData;
    this.db = leveldbWrapper.levelDb;
    if (!mainSystemAccount) {
      const ACTIVE_ACCOUNT = 'ACTIVE_ACCOUNT';
      this.storeGet(ACTIVE_ACCOUNT).then((activeAccount) => {
        if (activeAccount != null) {
          const mainSystemAccountRetrieved = Keypair.fromSecretKey(
            Uint8Array.from(
              JSON.parse(
                fs.readFileSync(
                  getAppDataPath() +
                    `/wallets/${activeAccount}_mainSystemWallet.json`,
                  'utf-8'
                )
              )
            )
          );
          this.#mainSystemAccount = mainSystemAccountRetrieved;
          this.mainSystemAccountPubKey = mainSystemAccountRetrieved?.publicKey;
        } else {
          this.#mainSystemAccount = null;
          this.mainSystemAccountPubKey = null;
        }
      });
    } else {
      this.#mainSystemAccount = mainSystemAccount;
      this.mainSystemAccountPubKey = mainSystemAccount?.publicKey;
    }

    if (this.taskData?.task_id)
      this.taskStateInfoPublicKey = new PublicKey(this.taskData.task_id);

    if (this.taskData?.stake_pot_account)
      this.STAKE_POT_ACCOUNT = new PublicKey(this.taskData.stake_pot_account);

    this.establishConnection();
  }
  /**
   * Namespace wrapper of storeGetAsync
   * @param {string} key // Path to get
   * @returns {Promise<*>} Promise containing data
   */
  async storeGet(key: string): Promise<string | null> {
    try {
      const response = await this.db.get(this.taskTxId + key, {
        asBuffer: false,
      });
      return response;
    } catch (e) {
      if (e.type == 'NotFoundError') {
        console.error(key, 'Not found');
      } else {
        console.error(e);
      }
      return null;
    }
  }
  /**
   * Namespace wrapper of storeGetAsync
   * @param {string} key // Path to get
   * @returns {Promise<*>} Promise containing data
   */
  async #storeGetRaw(key: string): Promise<string | null> {
    try {
      const response = await this.db.get(key, {
        asBuffer: false,
      });
      return response;
    } catch (e) {
      if (e.type == 'NotFoundError') {
        console.error(key, 'Not found');
      } else {
        console.error(e);
      }
      return null;
    }
  }
  /**
   * Namespace wrapper over storeSetAsync
   * @param {string} key Path to set
   * @param {*} value Data to set
   * @returns {Promise<void>}
   */
  async storeSet(key: string, value: string): Promise<any> {
    try {
      const response = await this.db.put(this.taskTxId + key, value);
      return response;
    } catch (e) {
      console.error(e);
      throw e;
    }
  }

  /**
   * Namespace wrapper of redisGetAsync
   * @param {string} key // Path to get
   * @returns {Promise<*>} Promise containing data
   */
  // async redisGet(key:any): Promise<string> {
  //   if (this.redisClient === undefined) throw 'Redis not connected';
  //   else
  //     try {
  //       const response = await this.redisClient.get(this.taskTxId + key);
  //       return response;
  //     } catch (e) {
  //       console.error(e);
  //       throw e;
  //     }
  // }
  /**
   *
   * @param key key od list to push
   * @param value element to push in List
   * @returns Element
   */
  // async redisLPush(key: string, value: any): Promise<any> {
  //   if (this.redisClient === undefined) throw 'Redis not connected';
  //   else
  //     try {
  //       const response = await this.redisClient.lPush(
  //         this.taskTxId + key,
  //         value,
  //       );
  //       return response;
  //     } catch (e) {
  //       console.error(e);
  //       throw e;
  //     }
  // }

  async JwtSign(data: object, secret: string): Promise<string> {
    const accessToken = jwt.sign(data, secret);
    return accessToken;
  }

  async JwtVerify(accessToken: string, secret: string): Promise<any> {
    const response = jwt.verify(accessToken, secret);
    return response;
  }

  /**
   *
   * @param key key of list
   * @param value element to delete
   * @param occurance number of occurances to delete
   * @returns confirmation of deleting the element from the list
   */
  // async redisLRem(key: string, occurance: number, value: any): Promise<any> {
  //   if (this.redisClient === undefined) throw 'Redis not connected';
  //   else
  //     try {
  //       const response = await this.redisClient.LREM(
  //         this.taskTxId + key,
  //         occurance,
  //         value,
  //       );
  //       return response;
  //     } catch (e) {
  //       console.error(e);
  //       throw e;
  //     }
  // }
  /**
   *
   * @param key Key of list to get elements from
   * @param start start Index
   * @param stop End index
   * @returns Array of elements
   */
  // async redisLRange(
  //   key: string,
  //   start: number,
  //   stop: number,
  // ): Promise<Array<any>> {
  //   if (this.redisClient === undefined) throw 'Redis not connected';
  //   else
  //     try {
  //       const response = await this.redisClient.lRange(
  //         this.taskTxId + key,
  //         start,
  //         stop,
  //       );
  //       return response;
  //     } catch (e) {
  //       console.error(e);
  //       throw e;
  //     }
  // }
  // async redisLLen(key:any): Promise<string> {
  //   if (this.redisClient === undefined) throw 'Redis not connected';
  //   else
  //     try {
  //       const response = await this.redisClient.lLen(this.taskTxId + key);
  //       return response;
  //     } catch (e) {
  //       console.error(e);
  //       throw e;
  //     }
  // }
  /**
   * Namespace wrapper over redisSetAsync
   * @param {string} key Path to set
   * @param {*} value Data to set
   * @returns {Promise<void>}
   */
  // async redisSet(key:any, value:any): Promise<any> {
  //   if (this.redisClient === undefined) throw 'Redis not connected';
  //   else
  //     try {
  //       const response = await this.redisClient.set(this.taskTxId + key, value);
  //       return response;
  //     } catch (e) {
  //       console.error(e);
  //       throw e;
  //     }
  // }

  /**
   * Namespace wrapper over fsPromises methods
   * @param {*} method The fsPromise method to call
   * @param {*} path Path for the express call
   * @param  {...any} args Remaining parameters for the FS call
   * @returns {Promise<any>}
   */
  async fs(method: any, path: any, ...args: any) {
    const basePath = getAppDataPath() + '/namespace/' + this.taskTxId;
    await fsPromises.mkdir(basePath, { recursive: true }).catch(console.error);
    return fsPromises[method](`${basePath}/${path}`, ...args);
  }

  async fsStaking(method: any, path: any, ...args: any) {
    const basePath = getAppDataPath() + '/namespace/';
    await fsPromises.mkdir(basePath, { recursive: true }).catch(console.error);
    return fsPromises[method](`${basePath}/${path}`, ...args);
  }

  async fsWriteStream(imagepath: string) {
    const basePath = getAppDataPath() + '/namespace/' + this.taskTxId;
    await fsPromises.mkdir(basePath, { recursive: true }).catch(console.error);
    const image = basePath + '/' + imagepath;
    const writer = fs.createWriteStream(image);
    return writer;
  }

  async fsReadStream(imagepath: string) {
    const basePath = getAppDataPath() + '/namespace/' + this.taskTxId;
    await fsPromises.mkdir(basePath, { recursive: true }).catch(console.error);
    const image = basePath + imagepath;
    const file = fs.readFileSync(image);
    return file;
  }
  // /**
  //  * Namespace wrapper over redisKeysAsync
  //  * @param {string} pattern Pattern of keys to be found
  //  * @returns {Promise<Array<String>>}
  //  */
  // redisKeys(pattern:any) {
  //   return new Promise((resolve, reject) => {
  //     if (this.redisClient === undefined) reject('Redis not connected');
  //     else
  //       this.redisClient.keys(this.taskTxId + pattern, (err:any, res:any) => {
  //         err ? reject(err) : resolve(res);
  //       });
  //   });
  // }

  // /**
  //  * Namespace wrapper over redisDelAsync
  //  * @param {string} key Key to delete
  //  * @returns {Promise<Number>}
  //  */
  // redisDel(key:any) {
  //   return new Promise((resolve, reject) => {
  //     if (this.redisClient === undefined) reject('Redis not connected');
  //     else
  //       this.redisClient.del(this.taskTxId + key, (err:any, res:any) => {
  //         err ? reject(err) : resolve(res);
  //       });
  //   });
  // }

  /**
   * Namespace wrapper over express app methods
   * @param {string} method // Receive method ["get", "post", "put", "delete"]
   * @param {string} path // Endpoint path appended to namespace
   * @param {Function} callback // Callback function on traffic receive
   */
  express(method: any, path: any, callback: any) {
    return this.app[method]('/' + this.taskTxId + path, callback);
  }

  /**
   * Loads redis client
   */
  loadRedisClient(config?: redisConfig): void {
    const host =
      config && config.redis_ip
        ? config.redis_ip
        : process.env.REDIS_IP || 'localhost';
    const port =
      config && config.redis_port
        ? config.redis_port
        : parseInt(process.env.REDIS_PORT || ('6379' as string));
    const password =
      config && config.redis_password
        ? config.redis_password
        : process.env.REDIS_PASSWORD || '';
    const username =
      config && config.username ? config.username : process.env.REDIS_USERNAME;
    if (!host || !port) throw Error('CANNOT READ REDIS IP OR PORT FROM ENV');
  }
  /**
   * Wrapper function for the OnChain submission for Task contract
   * @param {Connection} connection // The k2 connection object
   * @param {PublicKey} taskStateInfoKeypairPubKey // Task Id
   * @param {Keypair} submitterPubkey //The keypair of the submitter node
   * @param {string} submission // The actual submission to onchain (cannot pe greater than 512 bytes)
   */
  async submissionOnChain(
    submitterKeypair: Keypair,
    submission: string
  ): Promise<string> {
    if (submission.length > 512) {
      throw Error('Submission cannot be greater than 512 characters');
    }
    const data = encodeData(TASK_INSTRUCTION_LAYOUTS.SubmitTask, {
      submission: new TextEncoder().encode(
        padStringWithSpaces(submission, 512)
      ), //must be 512 chracters long
    });
    const instruction = new TransactionInstruction({
      keys: [
        {
          pubkey: this.taskStateInfoPublicKey,
          isSigner: false,
          isWritable: true,
        },
        {
          pubkey: submitterKeypair.publicKey,
          isSigner: true,
          isWritable: true,
        },
      ],
      programId: TASK_CONTRACT_ID,
      data: data,
    });

    try {
      const result = await sendAndConfirmTransaction(
        this.connection,
        new Transaction().add(instruction),
        [this.#mainSystemAccount, submitterKeypair]
      );
      return result;
    } catch (e) {
      throw new DetailedError({
        detailed: e,
        summary:
          'Whoops! Your transaction was not confirmed, please try again.',
        type: ErrorType.TRANSACTION_TIMEOUT,
      });
    }
  }
  /**
   * Wrapper function for the OnChain Voting for Task contract
   * @param {Connection} connection // The k2 connection object
   * @param {PublicKey} candidatePubkey // Candidate public key who submitted the task and you are approving whose task is correct
   * @param {Keypair} voterKeypair // Voter keypair optional, by default will use the your task account keypair
   * @param {boolean} isValid // Boolean indicating submission is valid or Invalid

   */
  async voteOnChain(
    candidatePubkey: PublicKey,
    isValid: boolean,
    voterKeypair: Keypair
  ): Promise<string> {
    candidatePubkey = new PublicKey(candidatePubkey);
    if (!voterKeypair) voterKeypair = this.submitterAccountKeyPair;
    const data = encodeData(TASK_INSTRUCTION_LAYOUTS.Vote, {
      is_valid: isValid,
    });
    const instruction = new TransactionInstruction({
      keys: [
        {
          pubkey: this.taskStateInfoPublicKey,
          isSigner: false,
          isWritable: true,
        },
        { pubkey: voterKeypair.publicKey, isSigner: true, isWritable: true },
        { pubkey: candidatePubkey, isSigner: false, isWritable: false }, //Candidate public key who submitted the task and you are approving whose task is correct
        { pubkey: SYSVAR_CLOCK_PUBKEY, isSigner: false, isWritable: false },
      ],
      programId: TASK_CONTRACT_ID,
      data: data,
    });
    try {
      const result = await sendAndConfirmTransaction(
        this.connection,
        new Transaction().add(instruction),
        [this.#mainSystemAccount, voterKeypair]
      );
      return result;
    } catch (e) {
      throw new DetailedError({
        detailed: e,
        summary:
          'Whoops! Your transaction was not confirmed, please try again.',
        type: ErrorType.TRANSACTION_TIMEOUT,
      });
    }
  }

  async stakeOnChain(
    taskStateInfoPublicKey: PublicKey,
    stakingAccKeypair: Keypair,
    stakePotAccount: PublicKey,
    stakeAmount: number
  ): Promise<string> {
    const data = encodeData(TASK_INSTRUCTION_LAYOUTS.Stake, { stakeAmount });
    const instruction = new TransactionInstruction({
      keys: [
        {
          pubkey: taskStateInfoPublicKey,
          isSigner: false,
          isWritable: true,
        },
        {
          pubkey: stakingAccKeypair.publicKey,
          isSigner: true,
          isWritable: true,
        },
        { pubkey: stakePotAccount, isSigner: false, isWritable: true },
        { pubkey: SYSVAR_CLOCK_PUBKEY, isSigner: false, isWritable: false },
      ],
      programId: TASK_CONTRACT_ID,
      data: data,
    });
    try {
      const response = await sendAndConfirmTransaction(
        this.connection,
        new Transaction().add(instruction),
        [this.#mainSystemAccount, stakingAccKeypair]
      );
      return response;
    } catch (e) {
      throw new DetailedError({
        detailed: e,
        summary:
          'Whoops! Your transaction was not confirmed, please try again.',
        type: ErrorType.TRANSACTION_TIMEOUT,
      });
    }
  }

  async claimReward(
    stakePotAccount: PublicKey,
    beneficiaryAccount: PublicKey,
    claimerKeypair: Keypair,
    taskStateInfoPublicKey?: PublicKey
  ): Promise<string> {
    if (!this.#mainSystemAccount) {
      throw Error('Please set the mainSystemAccount path before proceeding');
    }
    console.log('CLAIMER ACCOUNT', claimerKeypair.publicKey.toBase58());
    const data = encodeData(TASK_INSTRUCTION_LAYOUTS.ClaimReward, {});
    const instruction = new TransactionInstruction({
      keys: [
        {
          pubkey: taskStateInfoPublicKey
            ? taskStateInfoPublicKey
            : this.taskStateInfoPublicKey,
          isSigner: false,
          isWritable: true,
        },
        { pubkey: claimerKeypair.publicKey, isSigner: true, isWritable: true },
        { pubkey: stakePotAccount, isSigner: false, isWritable: true },
        { pubkey: beneficiaryAccount, isSigner: false, isWritable: true },
      ],
      programId: TASK_CONTRACT_ID,
      data: data,
    });
    console.log(
      'this.mainSystemAccount',
      this.#mainSystemAccount.publicKey.toBase58()
    );
    try {
      const response = await sendAndConfirmTransaction(
        this.connection,
        new Transaction().add(instruction),
        [this.#mainSystemAccount, claimerKeypair]
      );
      return response;
    } catch (e) {
      console.error(e);
      throw new DetailedError({
        detailed: e,
        summary:
          'Whoops! Your transaction was not confirmed, please try again.',
        type: ErrorType.TRANSACTION_TIMEOUT,
      });
    }
  }

  async sendTransaction(
    serviceNodeAccount: PublicKey,
    beneficiaryAccount: PublicKey,
    amount: number
  ): Promise<string> {
    const transaction = new Transaction().add(
      SystemProgram.transfer({
        fromPubkey: serviceNodeAccount,
        toPubkey: beneficiaryAccount,
        lamports: amount,
      })
    );
    try {
      // Sign transaction, broadcast, and confirm
      const signature = await sendAndConfirmTransaction(
        this.connection,
        transaction,
        [this.#mainSystemAccount]
      );
      console.log('SIGNATURE', signature);
      return signature;
    } catch (e) {
      console.error(e);
      throw new DetailedError({
        detailed: e,
        summary:
          'Whoops! Your transaction was not confirmed, please try again.',
        type: ErrorType.TRANSACTION_TIMEOUT,
      });
    }
  }

  async bs58Encode(data: any): Promise<string> {
    return bs58.encode(
      Buffer.from(data.buffer, data.byteOffset, data.byteLength)
    );
  }

  async bs58Decode(data: any): Promise<any> {
    return new Uint8Array(bs58.decode(data));
  }

  /**
   * @description Signs data with main system account secret key
   * @param data data to be signed
   */
  async signData(data: any) {
    const msg = new TextEncoder().encode(JSON.stringify(data));
    const signedMessage = nacl.sign(msg, this.#mainSystemAccount.secretKey);
    return await this.bs58Encode(signedMessage);
  }

  async verifySignedData(signedData: any, publicKey: any) {
    try {
      const payload = nacl.sign.open(
        await this.bs58Decode(signedData),
        await this.bs58Decode(publicKey)
      );
      if (!payload) return { error: 'Empty payload' };
      const decodedPayload = new TextDecoder().decode(payload);
      return { data: decodedPayload };
    } catch (e) {
      console.error(e);
      return { error: 'Empty payload' };
    }
  }

  /**
   * sendAndConfirmTransaction wrapper that injects mainSystemWallet as the first signer for paying the tx fees
   * @param {connection} method // Receive method ["get", "post", "put", "delete"]
   * @param {transaction} path // Endpoint path appended to namespace
   * @param {Function} callback // Callback function on traffic receive
   */
  async sendAndConfirmTransactionWrapper(
    transaction: any,
    signers: any[]
  ): Promise<string> {
    signers = signers.map((e) =>
      Keypair.fromSecretKey(
        Uint8Array.from(Object.values(e._keypair.secretKey))
      )
    );
    const response = await sendAndConfirmTransaction(
      this.connection,
      Transaction.from(transaction.data),
      [this.#mainSystemAccount, ...signers]
    );
    return response;
  }

  /**
   * @description to establish this.connection to your cluster
   */
  async establishConnection() {
    const rpcUrl = await getRpcUrlWrapper();
    this.connection = new Connection(rpcUrl, 'confirmed');
    console.log(`\n\nCluster RPC URL: ${rpcUrl}`);
    await this.connection.getVersion();
  }

  /**
   * @description Get the latest Task State
   * @returns task data in JSON format
   */
  async getTaskState() {
    this.taskAccountInfo = await this.connection.getAccountInfo(
      new PublicKey(this.taskStateInfoPublicKey)
    );
    if (this.taskAccountInfo === null) {
      throw 'Error: cannot find the task contract data';
    }
    return JSON.parse(this.taskAccountInfo.data.toString());
  }

  /**
   * @description Get the Task Account
   * @returns KeyPair of the  Task  Account
   */
  async getSubmitterAccount(): Promise<Keypair | null> {
    let submitterAccount: Keypair | null;
    try {
      const ACTIVE_ACCOUNT = 'ACTIVE_ACCOUNT';
      const activeAccount = await this.#storeGetRaw(ACTIVE_ACCOUNT);
      const STAKING_WALLET_PATH =
        getAppDataPath() + `/namespace/${activeAccount}_stakingWallet.json`;
      console.log({ STAKING_WALLET_PATH });
      if (!fs.existsSync(STAKING_WALLET_PATH)) return null;
      submitterAccount = Keypair.fromSecretKey(
        Uint8Array.from(
          JSON.parse(fs.readFileSync(STAKING_WALLET_PATH, 'utf-8'))
        )
      );
      console.log({ submitterAccount });
    } catch (e) {
      console.error(
        'Staking wallet not found. Please create a staking wallet and place it in the namespace folder'
      );
      submitterAccount = null;
    }
    return submitterAccount;
  }

  // /**
  //  * Deprecated - Single staking wallet now used
  //  * @description Create Task Account
  //  * @returns KeyPair of the  Task  Account
  //  */
  // async createSubmitterAccount() {
  //   const submitterAccount = Keypair.generate();
  //   console.log(
  //     'Making new submitter account wallet: ',
  //     submitterAccount.publicKey.toBase58(),
  //   );
  //   if (!process.env.MOBILE_STAKE) {
  //     throw 'Set MOBILE_STAKE environment variable';
  //   }
  //   const createSubmitterAccTransaction = new Transaction().add(
  //     SystemProgram.createAccount({
  //       fromPubkey: this.mainSystemAccountPubKey,
  //       newAccountPubkey: submitterAccount.publicKey,
  //       lamports:
  //         parseInt(process.env.MOBILE_STAKE) * LAMPORTS_PER_SOL +
  //         (await this.connection.getMinimumBalanceForRentExemption(100)) +
  //         10000, //Adding 10,000 extra lamports for padding
  //       space: 100,
  //       programId: new PublicKey(DEFAULT_PROGRAM_ID),
  //     }),
  //   );
  //   await this.sendAndConfirmTransactionWrapper(
  //     this.connection,
  //     createSubmitterAccTransaction,
  //     [submitterAccount],
  //   );
  //   // TODO remove this
  //   await sleep(10000);

  //   // Saving KeyPair secret file
  //   await this.fs(
  //     'writeFile',
  //     'submitterAccountWallet.json',
  //     JSON.stringify(Array.from(submitterAccount.secretKey)),
  //   );
  //   return submitterAccount;
  // }

  // /**
  //  * @description Checks the task state and change the voting flag  accordingly
  //  */
  // async checkVoteStatus() {
  //   console.log('******/  IN CHECK VOTE STATUS /******');
  //   // if the status is false and task is set to voting then do nothing
  //   const voteStatus = await this.storeGet('voteStatus');
  //   console.log('Current VoteStatus:', voteStatus);

  //   // checking the status of task
  //   // fetching the task state
  //   this.taskAccountInfo = await this.connection.getAccountInfo(
  //     new PublicKey(this.taskStateInfoPublicKey),
  //   );
  //   if (this.taskAccountInfo === null) {
  //     throw 'Error: cannot find the task contract data';
  //   }
  //   const taskAccountDataJSON = JSON.parse(
  //     this.taskAccountInfo.data.toString(),
  //   );
  //   const status = taskAccountDataJSON.status;
  //   const task_status = Object.keys(status)[0];
  //   console.log('Current task status:', task_status);

  //   if (voteStatus == 'false' && task_status == 'Voting') {
  //     console.log('Vote value check failed');
  //   }
  //   //else change the status to true
  //   else {
  //     console.log('Setting voting status');
  //     try {
  //       await this.storeSet('voteStatus', 'true');
  //     } catch (err) {
  //       console.warn('Error setting voting status', err);
  //     }
  //   }
  // }

  /**
   * @description Refers the value of round to know if submission is allowed or not
   */
  async checkSubmissionAndUpdateRound(submissionValue = 'default') {
    console.log('******/  IN SUBMISSION /******');
    const taskAccountDataJSON = await this.getTaskState();
    const current_round = taskAccountDataJSON.current_round;
    console.log('Submitting for round', current_round);
    try {
      const result = await this.storeGet('round');
      if (result == current_round) {
        console.log('No submission allowed until the next round');
      } else {
        console.log('Submitting to chain:', submissionValue);
        try {
          if (!this.submitterAccountKeyPair) await this.defaultTaskSetup();
          const response = await this.submissionOnChain(
            this.submitterAccountKeyPair,
            submissionValue
          );
          console.log('Submissions Response:', response);
        } catch (error) {
          console.warn('ERROR FROM SUBMIT_TASK', error);
        }
        // TODO remove this
        await sleep(1000);

        await this.storeSet('round', current_round);
      }
    } catch (err) {
      console.warn('Error submitting task to chain', err);
    }
  }
  /**
   * @description Get the latest Task State
   * @returns task data in JSON format
   */
  async getProgramAccounts() {
    const programAccounts = await this.connection.getProgramAccounts(
      new PublicKey(DEFAULT_PROGRAM_ID)
    );
    if (this.taskAccountInfo === null) {
      throw 'Error: cannot find the task contract data';
    }
    return programAccounts;
  }

  /**
   * @description Loop through the iteration of submissions and caste the vote if vote status is true
   *
   * TODO test this function more so functionality is consistent
   */
  async validateAndVoteOnNodes(validate: (node: any) => boolean) {
    // await this.checkVoteStatus();
    console.log('******/  IN VOTING /******');
    const taskAccountDataJSON = await this.getTaskState();
    const current_round = taskAccountDataJSON.current_round;
    const expected_round = current_round - 1;

    const status = taskAccountDataJSON.status;
    const task_status = Object.keys(status)[0];

    // const voteStatus = await this.storeGet('voteStatus');
    const lastVotedRound = await this.storeGet('lastVotedRound');
    console.log(
      `Task status: ${task_status}, Last Voted Round: ${lastVotedRound}, Submissions: ${
        Object.keys(taskAccountDataJSON.submissions).length
      }`
    );

    console.log('Submissions', taskAccountDataJSON.submissions);

    if (!TRUSTED_SERVICE_URL) console.warn('SERVICE_URL not set');
    const nodes = await getNodes(TRUSTED_SERVICE_URL);
    console.log('Nodes', nodes);

    console.log('expected_round.toString()', lastVotedRound, expected_round);
    if (
      lastVotedRound != expected_round.toString() &&
      task_status == 'Voting' &&
      Object.keys(taskAccountDataJSON.submissions).length > 0
    ) {
      // Filter only submissions from last round
      const submissions: any = {};
      for (const id in taskAccountDataJSON.submissions) {
        console.log(
          'round - expected',
          taskAccountDataJSON.submissions[id].round,
          expected_round
        );
        if (taskAccountDataJSON.submissions[id].round == expected_round) {
          submissions[id] = taskAccountDataJSON.submissions[id];
        }
      }
      const values: any = Object.values(submissions);
      const keys = Object.keys(submissions);
      const size = values.length;
      console.log('Submissions from last round: ', size, submissions);
      if (!this.submitterAccountKeyPair) await this.defaultTaskSetup();

      for (let i = 0; i < size; i++) {
        // Fetch candidate public key
        const candidatePublicKey = keys[i];
        const candidateKeyPairPublicKey = new PublicKey(keys[i]);
        if (candidatePublicKey == this.submitterPubkey) {
          console.log('YOU CANNOT VOTE ON YOUR OWN SUBMISSIONS');
        } else {
          // LOGIC for voting function
          const node = nodes.find((e) => e.submitterPubkey == keys[i]);
          const nodeData = node
            ? {
                url: node.data.url,
                ...values[i],
              }
            : values[i];
          const isValid = validate(nodeData);
          console.log(`Voting ${isValid} to ${candidatePublicKey}`);
          try {
            const response = await this.voteOnChain(
              candidateKeyPairPublicKey,
              isValid,
              this.submitterAccountKeyPair
            );

            console.log('RESPONSE FROM VOTING FUNCTION', response);
          } catch (error) {
            console.warn('ERROR FROM VOTING FUNCTION', error);
          }
        }
      }

      // After every iteration of checking the Submissions the Voting will be closed for that round
      try {
        await this.storeSet('lastVotedRound', `${expected_round}`);
      } catch (err) {
        console.warn('Error setting voting status', err);
      }
    } else {
      console.log('No voting allowed until next round');
    }
  }

  /**
   * @description Establishes the default setup of a task
   * - Establishes connection to cluster
   * - Connects to program
   * - Gets submitter accounts
   * - Creates submitter account if one does not exist
   * - Establishes stake
   * - Gets current round and voting status
   */
  async defaultTaskSetup() {
    await this.establishConnection();
    const submitterAccountKeyPair = await this.getSubmitterAccount();
    if (submitterAccountKeyPair) {
      this.submitterAccountKeyPair = submitterAccountKeyPair;
      this.submitterPubkey = this.submitterAccountKeyPair.publicKey.toBase58();
      console.log('Submitter key', this.submitterPubkey);
    }
  }
  /**
   * @description Get URL from K2_NODE_URL environment variable
   */
  async getRpcUrl() {
    return await getRpcUrlWrapper();
  }
  /**
   * Gets an array of service nodes
   * @param url URL of the service node to retrieve the array from a known service node
   * @returns Array of service nodes
   */
  async getNodes(url: string): Promise<Array<INode>> {
    try {
      const res = await axios.get(url + BUNDLER_NODES);
      console.log('RESPOSNE FROM GET NODES', res.data);
      return res.data;
    } catch (_e) {
      return [];
    }
  }
}
const namespaceInstance = new Namespace(
  '',
  null,
  process.env.NODE_MODE || 'service',
  null,
  {}
);

/**
 * @description Get URL from K2_NODE_URL environment variable
 */
async function getRpcUrlWrapper() {
  if (process.env.K2_NODE_URL) {
    return process.env.K2_NODE_URL;
  } else {
    console.warn(
      'Failed to fetch URL from K2_NODE_URL environment variable setting it to https://k2-testnet.koii.live'
    );
    return 'https://k2-testnet.koii.live';
  }
}
/**
 * @description Sleep utility function
 *
 * TODO remove this function after testing.
 * Awaiting a function should suffice
 */
async function sleep(ms: any) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

/**
 * Gets the node registry from Redis cache
 * @returns {Array<BundlerPayload<data:RegistrationData>>}
 */
async function getCacheNodes() {
  // Get nodes from cache
  let nodes;
  try {
    nodes = JSON.parse(
      (await namespaceInstance.storeGet('nodeRegistry')) || '[]'
    );
    if (nodes === null) nodes = [];
  } catch (e) {
    console.error(e);
    nodes = [];
  }
  return nodes;
}

/**
 * Gets an array of service nodes
 * @param url URL of the service node to retrieve the array from a known service node
 * @returns Array of service nodes
 */
async function getNodes(url: string): Promise<Array<INode>> {
  try {
    const res = await axios.get(url + BUNDLER_NODES);
    console.log('RESPOSNE FROM GET NODES', res.data);
    return res.data;
  } catch (_e) {
    return [];
  }
}

/**
 * Adds an array of nodes to the local registry
 * @param {Array<NodeRegistration>} newNodes
 * @returns {boolean} Wether some new nodes were added or not
 */
async function registerNodes(newNodes: any) {
  // Filter stale nodes from registry
  let nodes = await getCacheNodes();
  console.log(
    `Registry contains ${nodes.length} nodes. Registering ${newNodes.length} more`
  );

  // Verify each registration TODO process promises in parallel
  newNodes = newNodes.filter(async (node: any) => {
    // Filter registrations that don't have an owner or url
    const owner = node.owner;
    if (typeof owner !== 'string') {
      console.error('Invalid node input:', node);
      return false;
    }

    // TODO: Filter addresses with an invalid signature
    // return await tools.verifySignature(node);
    return true;
  });

  // Filter out duplicate entries
  const latestNodes: any = {};
  for (const node of nodes.concat(newNodes)) {
    // Filter registrations that don't have an owner or url
    const owner = node.owner;
    if (
      typeof owner !== 'string' ||
      node.data === undefined ||
      typeof node.data.url !== 'string' ||
      typeof node.data.timestamp !== 'number'
    ) {
      console.error('Invalid node input:', node);
      continue;
    }

    // Filter addresses that don't have a stake
    // const address = await arweave.wallets.ownerToAddress(owner);

    // // TODO: Get the stake for each address
    // if (!(address in state.stakes)) {
    //     console.error("Node tried registering without stake:", address);
    //     continue;
    // }

    // Make this node the latest if the timestamp is more recent
    const latest = latestNodes[owner];
    if (latest === undefined || node.data.timestamp > latest.data.timestamp)
      latestNodes[owner] = node;
  }

  nodes = Object.values(latestNodes);

  // Update registry
  console.log(`Registry now contains ${nodes.length} nodes`);
  await namespaceInstance.storeSet('nodeRegistry', JSON.stringify(nodes));

  return newNodes.length > 0;
}
function encodeData(type: any, fields: any) {
  const allocLength =
    type.layout.span >= 0 ? type.layout.span : getAlloc(type, fields);
  const data = Buffer.alloc(allocLength);
  const layoutFields = Object.assign({ instruction: type.index }, fields);
  type.layout.encode(layoutFields, data);
  return data;
}
function getAlloc(type: any, fields: any) {
  let alloc = 0;
  type.layout.fields.forEach((item: any) => {
    if (item.span >= 0) {
      alloc += item.span;
    } else if (typeof item.alloc === 'function') {
      alloc += item.alloc(fields[item.property]);
    }
  });
  return alloc;
}

function padStringWithSpaces(input: string, length: number) {
  if (input.length > length)
    throw Error('Input exceeds the maxiumum length of ' + length);
  input = input.padEnd(length);
  return input;
}
export { Namespace, getNodes, registerNodes, getCacheNodes, namespaceInstance };
