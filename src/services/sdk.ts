const Web3 = require('@_koi/web3.js');

import config from '../config';

console.log('Connection: ', Web3.Connection);

const k2Connection = new Web3.Connection(config.node.k2_NETWORK_URL);
export default {
  k2Connection,
};
