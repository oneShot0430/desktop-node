import kohaku from '@_koi/kohaku';
import { Node } from '@_koi/sdk/node';
import { Connection } from '@_koi/web3.js';

import config from 'config';

const koiiTools = new Node(config.node.BUNDLER_URL, config.node.KOII_CONTRACT);

const k2Connection = new Connection(config.node.k2_NETWORK_URL);
export default {
  kohaku,
  koiiTools,
  k2Connection,
};
