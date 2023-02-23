import config from '../../config';
import {
  CreateNodeWalletsParam,
  CreateNodeWalletsResponse,
} from '../../models/api';
import sendMessage from '../sendMessage';

export default (
  payload: CreateNodeWalletsParam
): Promise<CreateNodeWalletsResponse> =>
  sendMessage(config.endpoints.CREATE_NODE_WALLETS, payload);
