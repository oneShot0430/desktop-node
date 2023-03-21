import { Event } from 'electron';
import * as fsSync from 'fs';
import fs from 'fs';

import { Keypair } from '@_koi/web3.js';
import { namespaceInstance } from 'main/node/helpers/Namespace';
import { ErrorType, GetStakingAccountPubKeyResponse } from 'models';
import { throwDetailedError } from 'utils';

import { getAppDataPath } from '../node/helpers/getAppDataPath';

const stakingAccountPubKey = async (
  event?: Event
): Promise<GetStakingAccountPubKeyResponse> => {
  // console.log('IN THE API');
  let stakingAccount;
  let pubkey: string;

  const activeAccount = await namespaceInstance.storeGet('ACTIVE_ACCOUNT');
  if (!activeAccount) {
    return throwDetailedError({
      detailed: 'Please select an active account',
      type: ErrorType.NO_ACTIVE_ACCOUNT,
    });
  }
  const stakingWalletfilePath = `${getAppDataPath()}/namespace/${activeAccount}_stakingWallet.json`;
  if (fs.existsSync(stakingWalletfilePath)) {
    try {
      stakingAccount = Keypair.fromSecretKey(
        Uint8Array.from(
          JSON.parse(
            fsSync.readFileSync(stakingWalletfilePath, 'utf-8')
          ) as Uint8Array
        )
      );
      pubkey = stakingAccount.publicKey.toBase58();
      // console.log('PUBKEY', pubkey);
      return pubkey;
    } catch (e: any) {
      console.error(e);
      return 'null';
    }
  } else {
    console.log('Staking wallet do not exists at ', stakingWalletfilePath);
    return 'null';
  }
};

export default stakingAccountPubKey;
