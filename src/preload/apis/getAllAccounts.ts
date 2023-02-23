import config from '../../config';
import { getAllAccountsResponse } from '../../models/api';
import sendMessage from '../sendMessage';

export default (): Promise<getAllAccountsResponse> =>
  sendMessage(config.endpoints.GET_ALL_ACCOUNTS, {});
