import { Event } from 'electron';

import { generateMnemonic } from 'bip39';

const generateSeedPhrase = async (event: Event): Promise<string> => {
  const mnemonic = generateMnemonic();
  return mnemonic;
};

export default generateSeedPhrase;
