import config from 'config';
import { GetStakingAccountPubKeyResponse } from 'models';

import sendMessage from '../sendMessage';

export default (): Promise<GetStakingAccountPubKeyResponse> =>
  sendMessage(config.endpoints.GET_STAKING_ACCOUNT_PUBKEY, {});
