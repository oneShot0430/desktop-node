import { Connection } from '@_koi/web3.js';

import config from '../../config';

const k2Connection = new Connection(config.node.k2_NETWORK_URL);
export default {
  k2Connection,
};
