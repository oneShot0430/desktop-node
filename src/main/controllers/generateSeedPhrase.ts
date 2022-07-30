import { Event } from 'electron';

import { generateMnemonic } from 'bip39';

import mainErrorHandler from '../../utils/mainErrorHandler';

const generateSeedPhrase = async (event: Event): Promise<string> => {
  const mnemonic = generateMnemonic();
  return mnemonic;
};

export default mainErrorHandler(generateSeedPhrase);
