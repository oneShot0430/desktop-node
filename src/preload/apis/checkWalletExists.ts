import config from 'config';
import { CheckWalletExistsParameters, CheckWalletExistsResponse } from 'models';
import sendMessage from 'preload/sendMessage';

export default (
  payload: CheckWalletExistsParameters
): Promise<CheckWalletExistsResponse> =>
  sendMessage(config.endpoints.CHECK_WALLET_EXISTS, payload);
