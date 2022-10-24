import { shell } from 'electron';

import { OpenFaucetParam } from 'models/api';

import { FAUCET_URL } from '../../constants';
import mainErrorHandler from '../../utils/mainErrorHandler';

const openFaucet = async (_: Event, { publicKey }: OpenFaucetParam) => {
  shell.openExternal(`${FAUCET_URL}${publicKey}`);
};

export default mainErrorHandler(openFaucet);
