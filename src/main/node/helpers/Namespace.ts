import fsPromises from 'fs/promises';

import { Express } from 'express';

import sdk from 'services/sdk';


export default class Namespace {
  taskTxId: string
  app: Express

  /**
   * @param {*} taskTxId Tasks transaction ID to be used as the namespace name
   * @param {*} expressApp // Express app for configuration
   */
  constructor(taskTxId: string, expressApp: Express) {
    this.taskTxId = taskTxId;
    this.app = expressApp;
  }

  /**
   * Namespace wrapper of redisGetAsync
   * @param {string} path // Path to get
   * @returns {Promise<*>} Promise containing data
   */
  redisGet(path: string): Promise<any> {
    return sdk.koiiTools.redisGetAsync(this.taskTxId + path);
  }

  /**
   * Namespace wrapper over redisSetAsync
   * @param {string} path Path to set
   * @param {*} data Data to set
   * @returns {Promise<void>}
   */
  redisSet(path: string, data: any): Promise<any> {
    return sdk.koiiTools.redisSetAsync(this.taskTxId + path, data);
  }

  /**
   * Namespace wrapper over fsPromises methods
   * @param {*} method The fsPromise method to call
   * @param {*} path Path for the express call
   * @param  {...any} args Remaining parameters for the FS call
   * @returns {Promise<any>}
   */
  async fs(method: string, path: string, ...args: any[]): Promise<any> {
    const basePath = 'namespace/' + this.taskTxId;
    await fsPromises.mkdir(basePath, { recursive: true }).catch(() => {/** */});
    return fsPromises[method](`${basePath}/${path}`, ...args);
  }

  /**
   * Namespace wrapper over express app methods
   * @param {string} method // Receive method ["get", "post", "put", "delete"]
   * @param {string} path // Endpoint path appended to namespace
   * @param {Function} callback // Callback function on traffic receive
   */
  express(method: string, path: string, callback: FunctionConstructor): void {
    type MethodKey = keyof typeof this.app
    this.app[method as MethodKey]('/' + this.taskTxId + path, callback);
  }
}
