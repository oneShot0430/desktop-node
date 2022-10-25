import config from 'config';
import { OpenFaucetParam } from 'models/api';
import sendMessage from 'preload/sendMessage';

export default (payload: OpenFaucetParam) =>
  sendMessage(config.endpoints.OPEN_FAUCET, payload);
