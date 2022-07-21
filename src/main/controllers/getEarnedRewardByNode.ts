import { Event } from 'electron';
import * as fsSync from 'fs';

import { Keypair } from '@_koi/web3.js';

import mainErrorHandler from '../../utils/mainErrorHandler';

interface rewardWalletPayload {
  available_balances: any;
}

const rewardWallet = async (
  event: Event,
  payload: rewardWalletPayload
): Promise<unknown> => {
  const { available_balances } = payload;
  //console.log('AVAILABLE_BALANCE', available_balances);
  //console.log('IN THE API');
  let stakingAccKeypair;
  try {
    stakingAccKeypair = Keypair.fromSecretKey(
      Uint8Array.from(
        JSON.parse(fsSync.readFileSync('namespace/stakingWallet.json', 'utf-8'))
      )
    );
    const stakingPubkey = stakingAccKeypair.publicKey.toBase58();
    //console.log('STAKING PUBLIC KEY', stakingPubkey);
    const size = Object.keys(available_balances).length;
    //console.log('SIZE', size);
    const keys = Object.keys(available_balances);
    const values = Object.values(available_balances);
    let reward: unknown;

    for (let i = 0; i < size; i++) {
      // eslint-disable-next-line prefer-const
      let candidatePublicKey = keys[i];
      console.log('CANDIDATE PUBLIC KEY', candidatePublicKey);
      if (candidatePublicKey == stakingPubkey) {
        reward = values[i];
        console.log('REWARD', reward);
      }
    }
    return reward;
  } catch (e) {
    console.error(e);
    throw Error("System Account or StakingWallet Account doesn't exist");
  }
};

export default mainErrorHandler(rewardWallet);
