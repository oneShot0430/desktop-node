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
} from '@_koi/web3.js';
import axios from 'axios';

import leveldbWrapper from './leveldb';

// import * as redis from 'redis';

// eslint-disable-next-line
const BufferLayout = require('@solana/buffer-layout');

interface redisConfig {
  redis_ip?: string;
  redis_port?: number;
  redis_password?: string;
  username?: string;
}
interface TaskData {
  task_id?: string;
  task_name?: string;
  task_manager?: string;
  task_audit_program?: string;
  stake_pot_account?: string;
  bounty_amount_per_round?: number;
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
  // #redisClient?: any;
  taskData: TaskData;
  #mainSystemAccount: Keypair;
  mainSystemAccountPubKey: PublicKey;
  db: any;
  constructor(
    taskTxId: string,
    expressApp: any,
    operationMode: string,
    mainSystemAccount: Keypair,
    taskData: TaskData
  ) {
    this.taskTxId = taskTxId;
    this.app = expressApp;
    if (operationMode === 'service') {
      // this.loadRedisClient();
    }
    this.#mainSystemAccount = mainSystemAccount;
    this.mainSystemAccountPubKey = mainSystemAccount.publicKey;
    this.taskData = taskData;
    this.db = leveldbWrapper.levelDb;
  }

  /**
   * Namespace wrapper of storeGetAsync
   * @param {string} key // Path to get
   * @returns {Promise<*>} Promise containing data
   */
  async storeGet(key: string): Promise<string> {
    try {
      const response = await this.db.get(this.taskTxId + key);
      return response.toString();
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
  // /**
  //  * Namespace wrapper of storeGetAsync
  //  * @param {string} key // Path to get
  //  * @returns {Promise<*>} Promise containing data
  //  */
  // async storeGet(key: string): Promise<string> {
  //   if (this.#redisClient === undefined) throw 'Redis not connected';
  //   else
  //     try {
  //       const response = await this.#redisClient.get(this.taskTxId + key);
  //       return response;
  //     } catch (e) {
  //       console.error(e);
  //       throw e;
  //     }
  // }
  // /**
  //  *
  //  * @param key key od list to push
  //  * @param value element to push in List
  //  * @returns Element
  //  */
  // async redisLPush(key: string, value: any): Promise<any> {
  //   if (this.#redisClient === undefined) throw 'Redis not connected';
  //   else
  //     try {
  //       const response = await this.#redisClient.lPush(
  //         this.taskTxId + key,
  //         value
  //       );
  //       return response;
  //     } catch (e) {
  //       console.error(e);
  //       throw e;
  //     }
  // }

  // /**
  //  *
  //  * @param key key of list
  //  * @param value element to delete
  //  * @param occurance number of occurances to delete
  //  * @returns confirmation of deleting the element from the list
  //  */
  // async redisLRem(key: string, occurance: number, value: any): Promise<any> {
  //   if (this.#redisClient === undefined) throw 'Redis not connected';
  //   else
  //     try {
  //       const response = await this.#redisClient.LREM(
  //         this.taskTxId + key,
  //         occurance,
  //         value
  //       );
  //       return response;
  //     } catch (e) {
  //       console.error(e);
  //       throw e;
  //     }
  // }
  // /**
  //  *
  //  * @param key Key of list to get elements from
  //  * @param start start Index
  //  * @param stop End index
  //  * @returns Array of elements
  //  */
  // async redisLRange(
  //   key: string,
  //   start: number,
  //   stop: number
  // ): Promise<Array<any>> {
  //   if (this.#redisClient === undefined) throw 'Redis not connected';
  //   else
  //     try {
  //       const response = await this.#redisClient.lRange(
  //         this.taskTxId + key,
  //         start,
  //         stop
  //       );
  //       return response;
  //     } catch (e) {
  //       console.error(e);
  //       throw e;
  //     }
  // }
  // async redisLLen(key: string): Promise<string> {
  //   if (this.#redisClient === undefined) throw 'Redis not connected';
  //   else
  //     try {
  //       const response = await this.#redisClient.lLen(this.taskTxId + key);
  //       return response;
  //     } catch (e) {
  //       console.error(e);
  //       throw e;
  //     }
  // }
  // /**
  //  * Namespace wrapper over storeSetAsync
  //  * @param {string} key Path to set
  //  * @param {*} value Data to set
  //  * @returns {Promise<void>}
  //  */
  // async storeSet(key: string, value: string): Promise<any> {
  //   if (this.#redisClient === undefined) throw 'Redis not connected';
  //   else
  //     try {
  //       const response = await this.#redisClient.set(
  //         this.taskTxId + key,
  //         value
  //       );
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
  async fs(method: string, path: string, ...args: any) {
    const basePath = 'namespace/' + this.taskTxId;
    await fsPromises.mkdir(basePath, { recursive: true }).catch(console.error);
    return fsPromises[method](`${basePath}/${path}`, ...args);
  }

  async fsStaking(method: string, path: string, ...args: any) {
    const basePath = 'namespace/';
    await fsPromises.mkdir(basePath, { recursive: true }).catch(console.error);
    return fsPromises[method](`${basePath}/${path}`, ...args);
  }

  async fsWriteStream(imagepath: string) {
    const basePath = 'namespace/' + this.taskTxId;
    await fsPromises.mkdir(basePath, { recursive: true }).catch(console.error);
    const image = basePath + '/' + imagepath;
    const writer = fs.createWriteStream(image);
    return writer;
  }

  async fsReadStream(imagepath: string) {
    const basePath = 'namespace/' + this.taskTxId;
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
  // redisKeys(pattern: string) {
  //   return new Promise((resolve, reject) => {
  //     if (this.#redisClient === undefined) reject('Redis not connected');
  //     else
  //       this.#redisClient.keys(
  //         this.taskTxId + pattern,
  //         (err: any, res: any) => {
  //           err ? reject(err) : resolve(res);
  //         }
  //       );
  //   });
  // }

  // /**
  //  * Namespace wrapper over redisDelAsync
  //  * @param {string} key Key to delete
  //  * @returns {Promise<Number>}
  //  */
  // redisDel(key: string) {
  //   return new Promise((resolve, reject) => {
  //     if (this.#redisClient === undefined) reject('Redis not connected');
  //     else
  //       this.#redisClient.del(this.taskTxId + key, (err: any, res: any) => {
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
  express(method: string, path: string, callback: any) {
    return this.app[method]('/' + this.taskTxId + path, callback);
  }

  /**
   * Loads redis client
   */
  // loadRedisClient(redisConfig?: redisConfig): void {
  //   const host =
  //     redisConfig && redisConfig.redis_ip
  //       ? redisConfig.redis_ip
  //       : config.node.REDIS.IP;
  //   const port =
  //     redisConfig && redisConfig.redis_port
  //       ? redisConfig.redis_port
  //       : config.node.REDIS.PORT;
  //   const password =
  //     redisConfig && redisConfig.redis_password
  //       ? redisConfig.redis_password
  //       : '';
  //   const username =
  //     redisConfig && redisConfig.username
  //       ? redisConfig.username
  //       : process.env.REDIS_USERNAME;
  //   if (!host || !port) throw Error('CANNOT READ REDIS IP OR PORT FROM ENV');
  //   this.#redisClient = redis.createClient({
  //     url: `redis://${username || ''}:${password}@${host}:${port}`,
  //   });
  //   this.#redisClient.connect();
  //   this.#redisClient.on('error', function (error: any) {
  //     console.error('redisClient ' + error);
  //   });
  // }
  async submissionOnChain(
    connection: Connection,
    taskStateInfoKeypairPubKey: PublicKey,
    submitterKeypair: Keypair,
    stakePotAccount: PublicKey,
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
          pubkey: taskStateInfoKeypairPubKey,
          isSigner: false,
          isWritable: true,
        },
        {
          pubkey: submitterKeypair.publicKey,
          isSigner: true,
          isWritable: true,
        },
        { pubkey: stakePotAccount, isSigner: false, isWritable: true },
      ],
      programId: TASK_CONTRACT_ID,
      data: data,
    });
    const result = await sendAndConfirmTransaction(
      connection,
      new Transaction().add(instruction),
      [this.#mainSystemAccount, submitterKeypair]
    );
    return result;
  }
  async voteOnChain(
    connection: Connection,
    taskStateInfoKeypairPubKey: PublicKey,
    submitterPubkey: PublicKey,
    voterKeypair: Keypair,
    isValid: boolean
  ): Promise<string> {
    const data = encodeData(TASK_INSTRUCTION_LAYOUTS.Vote, {
      is_valid: isValid,
    });
    const instruction = new TransactionInstruction({
      keys: [
        {
          pubkey: taskStateInfoKeypairPubKey,
          isSigner: false,
          isWritable: true,
        },
        { pubkey: voterKeypair.publicKey, isSigner: true, isWritable: true },
        { pubkey: submitterPubkey, isSigner: false, isWritable: false }, //Candidate public key who submitted the task and you are approving whose task is correct
        { pubkey: SYSVAR_CLOCK_PUBKEY, isSigner: false, isWritable: false },
      ],
      programId: TASK_CONTRACT_ID,
      data: data,
    });
    const result = await sendAndConfirmTransaction(
      connection,
      new Transaction().add(instruction),
      [this.#mainSystemAccount, voterKeypair]
    );
    return result;
  }
  async stakeOnChain(
    connection: Connection,
    taskAccountPubKey: PublicKey,
    stakingAccKeypair: Keypair,
    stakePotAccount: PublicKey,
    stakeAmount: number
  ): Promise<string> {
    const data = encodeData(TASK_INSTRUCTION_LAYOUTS.Stake, { stakeAmount });
    const instruction = new TransactionInstruction({
      keys: [
        {
          pubkey: taskAccountPubKey,
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
    const response = await sendAndConfirmTransaction(
      connection,
      new Transaction().add(instruction),
      [this.#mainSystemAccount, stakingAccKeypair]
    );
    return response;
  }

  async claimReward(
    connection: Connection,
    taskStateInfoAddress: PublicKey,
    stakePotAccount: PublicKey,
    beneficiaryAccount: PublicKey,
    claimerKeypair: Keypair
  ): Promise<string> {
    const data = encodeData(TASK_INSTRUCTION_LAYOUTS.ClaimReward, {});
    const instruction = new TransactionInstruction({
      keys: [
        { pubkey: taskStateInfoAddress, isSigner: false, isWritable: true },
        { pubkey: claimerKeypair.publicKey, isSigner: true, isWritable: true },
        { pubkey: stakePotAccount, isSigner: false, isWritable: true },
        { pubkey: beneficiaryAccount, isSigner: false, isWritable: true },
      ],
      programId: TASK_CONTRACT_ID,
      data: data,
    });
    const response = await sendAndConfirmTransaction(
      connection,
      new Transaction().add(instruction),
      [this.#mainSystemAccount, claimerKeypair]
    );
    return response;
  }
  /**
   * sendAndConfirmTransaction wrapper that injects mainSystemWallet as the first signer for paying the tx fees
   * @param {connection} method // Receive method ["get", "post", "put", "delete"]
   * @param {transaction} path // Endpoint path appended to namespace
   * @param {Function} callback // Callback function on traffic receive
   */
  async sendAndConfirmTransactionWrapper(
    connection: Connection,
    transaction: Transaction,
    signers: Keypair[]
  ): Promise<string> {
    const response = await sendAndConfirmTransaction(connection, transaction, [
      this.#mainSystemAccount,
      ...signers,
    ]);
    return response;
  }
}
const namespaceInstance = new Namespace('', null, 'service', new Keypair(), {});

/**
 * Gets the node registry from Redis cache
 * @returns {Array<BundlerPayload<data:RegistrationData>>}
 */
async function getCacheNodes() {
  // Get nodes from cache
  let nodes;
  try {
    nodes = JSON.parse(await namespaceInstance.storeGet('nodeRegistry'));
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
async function getNodes(url: string): Promise<Array<any>> {
  const res = await axios.get(url + BUNDLER_NODES);
  try {
    return JSON.parse(res.data as string);
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
