import Web3 from '@_koi/web3.js';

import config from '../config';

const k2Connection = new Web3.Connection(config.node.k2_NETWORK_URL);
export default {
  k2Connection,
};

// class Web3SingletonWrapper {
//   private _k2Connection: Connection | undefined;
//   get k2Connection() {
//     if (!this._k2Connection) {
//       console.log('CREATE Web3SingletonWrapper', Web3);
//       this._k2Connection = new Web3.Connection(config.node.k2_NETWORK_URL);
//     }
//     return this._k2Connection;
//   }
// }
//
// const web3SingletonWrapper = new Web3SingletonWrapper();
// export = web3SingletonWrapper;
