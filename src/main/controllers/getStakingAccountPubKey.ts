import { Event } from 'electron';
import * as fsSync from 'fs';
import fs from 'fs';

import { Keypair } from '@_koi/web3.js';

import { namespaceInstance } from 'main/node/helpers/Namespace';
import { DetailedError, ErrorType } from 'utils';

import { GetStakingAccountPubKeyResponse } from '../../models/api';
import mainErrorHandler from '../../utils/mainErrorHandler';
import { getAppDataPath } from '../node/helpers/getAppDataPath';

const stakingAccountPubKey = async (
  event: Event
): Promise<GetStakingAccountPubKeyResponse> => {
  //console.log('IN THE API');
  let stakingAccount;
  let pubkey: string;
  let activeAccount;
  try {
    activeAccount = await namespaceInstance.storeGet('ACTIVE_ACCOUNT');
  } catch (e) {
    throw new DetailedError({
      detailed: e,
      summary: 'Select an account to get its staking public key.',
      type: ErrorType.NO_ACTIVE_ACCOUNT,
    });
  }
  const stakingWalletfilePath =
    getAppDataPath() + `/namespace/${activeAccount}_stakingWallet.json`;
  if (fs.existsSync(stakingWalletfilePath)) {
    try {
      stakingAccount = Keypair.fromSecretKey(
        Uint8Array.from(
          JSON.parse(fsSync.readFileSync(stakingWalletfilePath, 'utf-8'))
        )
      );
      pubkey = stakingAccount.publicKey.toBase58();
      //console.log('PUBKEY', pubkey);
      return pubkey;
    } catch (e) {
      console.error(e);
      return null;
    }
  } else {
    console.log('Staking wallet do not exists at ', stakingWalletfilePath);
    return null;
  }
};

export default mainErrorHandler(stakingAccountPubKey);
