import config from 'config';
import sendMessage from 'preload/sendMessage';

interface DelegateStakeParam {
  taskAccountPubKey: string;
  stakeAmount: number;
}

export default (payload: DelegateStakeParam): Promise<string> =>
  sendMessage(config.endpoints.DELEGATE_STAKE, payload);
