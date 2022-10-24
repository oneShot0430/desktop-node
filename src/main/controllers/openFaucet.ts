import { shell } from 'electron';

import config from 'config';
import { OpenFaucetParam } from 'models/api';

import mainErrorHandler from '../../utils/mainErrorHandler';

const { FAUCET_URL } = config.faucet;

const openFaucet = async (_: Event, { publicKey }: OpenFaucetParam) => {
  shell.openExternal(`${FAUCET_URL}${publicKey}`);
};

export default mainErrorHandler(openFaucet);
