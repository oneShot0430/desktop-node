import { Keypair, Connection, PublicKey } from '@_koi/web3.js';

import config from 'config';
import sendMessage from 'preload/sendMessage';
import { Task } from 'preload/type/tasks';

interface DelegateStakeParam {
  taskAccountPubKey: PublicKey;
  stakeAmount: number;
}

export default (payload: DelegateStakeParam): Promise<string> =>
  sendMessage(config.endpoints.DELEGATE_STAKE, payload);
