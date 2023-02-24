import config from 'config';
import { ClaimRewardParam, ClaimRewardResponse } from 'models/api';

import sendMessage from '../sendMessage';

export default (payload: ClaimRewardParam): Promise<ClaimRewardResponse> =>
  sendMessage(config.endpoints.CLAIM_REWARD, payload);
