import { Event } from 'electron';
import fs from 'fs';

import { CheckWalletExistsResponse } from 'models/api';

import mainErrorHandler from '../../utils/mainErrorHandler';
import { namespaceInstance } from '../node/helpers/Namespace';

const checkWallet = async (
  event: Event
): Promise<CheckWalletExistsResponse> => {
  console.log('IN THE API');
  let mainSystemAccount: boolean;
  let stakingWallet: boolean;
  const filePath = 'namespace' + '/stakingWallet.json';
  try {
    if (fs.existsSync(filePath)) {
      stakingWallet = true;
    } else {
      stakingWallet = false;
    }
  } catch (err) {
    console.error('ERROR IN  STAKING ACCOUNT CHECK', err);
  }
  try {
    const wallet = await namespaceInstance.storeGet('WALLET_LOCATION');
    console.log('WALLET PATH', wallet);
    if (wallet == undefined) {
      mainSystemAccount = false;
    } else {
      mainSystemAccount = true;
    }
  } catch (err) {
    console.log('CATCH IN REDIS GET', err);
  }
  const check = {
    mainSystemAccount: mainSystemAccount,
    stakingWallet: stakingWallet,
  };
  return check;
};

export default mainErrorHandler(checkWallet);
