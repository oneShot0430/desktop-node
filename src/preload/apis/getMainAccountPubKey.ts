import config from '../../config';
import { GetMainAccountPubKeyResponse } from '../../models/api';
import sendMessage from '../sendMessage';

export default (): Promise<GetMainAccountPubKeyResponse> =>
  sendMessage(config.endpoints.GET_MAIN_ACCOUNT_PUBKEY, {});
