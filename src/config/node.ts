export const REDIS = {
  IP: 'localhost',
  PORT: 6379,
};

export const BUNDLER_URL = 'https://mainnet.koii.live';

export const RESTORE_KOHAKU = true;

export const SERVER_PORT = 8080;

export const ARWEAVE_GATEWAY_URL = 'https://arweave.net';
export const IPFS_GATEWAY_URL = 'https://ipfs.io/ipfs';

export const TESTNET_RPC_URL = 'https://k2-testnet.koii.live';
export const DEVNET_RPC_URL = 'https://k2-devnet.koii.live';

export const DEFAULT_K2_NETWORK_URL = TESTNET_RPC_URL;

export const TASK_CONTRACT_ID = 'Koiitask22222222222222222222222222222222222';

const MINIMUM_ACCEPTED_LENGTH_TASK_CONTRACT = 500;

// value in ROE
const TASK_FEE = 50000000;

export default {
  REDIS,
  BUNDLER_URL,
  RESTORE_KOHAKU,
  SERVER_PORT,
  ARWEAVE_GATEWAY_URL,
  IPFS_GATEWAY_URL,
  DEFAULT_K2_NETWORK_URL,
  TASK_CONTRACT_ID,
  MINIMUM_ACCEPTED_LENGTH_TASK_CONTRACT,
  TASK_FEE,
};
