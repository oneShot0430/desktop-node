import config from 'config';
import {
  CreateStakingWalletParam,
  CreateStakingWalletResponse,
} from 'models/api';
import sendMessage from 'preload/sendMessage';

export default (
  payload: CreateStakingWalletParam
): Promise<CreateStakingWalletResponse> =>
  sendMessage(config.endpoints.CREATE_STAKING_WALLET, payload);
