import { Connection } from '@_koi/web3.js';
import { getK2NetworkUrl } from 'main/node/helpers/k2NetworkUrl';

const k2NetworkUrl = getK2NetworkUrl();
const k2Connection = new Connection(k2NetworkUrl, {
  disableRetryOnRateLimit: true,
});

export default {
  k2Connection,
};
