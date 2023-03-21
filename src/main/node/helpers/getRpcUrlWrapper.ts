import { K2_NETWORK_URL } from '../../../config/node';

export function getRpcUrlWrapper(isDev?: boolean) {
  if (process.env.K2_NODE_URL) {
    return process.env.K2_NODE_URL;
  } else {
    console.warn(
      'Failed to fetch URL from K2_NODE_URL environment variable setting it to https://k2-testnet.koii.live'
    );
    return K2_NETWORK_URL;
    // return 'https://k2-testnet.koii.live';
  }
}
