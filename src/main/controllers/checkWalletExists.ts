import { Event } from 'electron';
import fs from 'fs';

import { namespaceInstance } from 'main/node/helpers/Namespace';
import { CheckWalletExistsResponse } from 'models/api';

import mainErrorHandler from '../../utils/mainErrorHandler';

const checkWallet = async (
  event: Event
): Promise<CheckWalletExistsResponse> => {
  console.log('IN THE API');
  let mainSystemAccount: boolean;
  let stakingWallet: boolean;
  const activeAccount = await namespaceInstance.storeGet('ACTIVE_ACCOUNT');
  if (!activeAccount) {
    throw new Error('Please select a Active Account');
  }
  const stakingWalletfilePath = `namespace/${activeAccount}_stakingWallet.json`;
  const mainWalletfilePath = `wallets/${activeAccount}_mainSystemWallet.json`;

  try {
    if (fs.existsSync(stakingWalletfilePath)) {
      stakingWallet = true;
    } else {
      stakingWallet = false;
    }
  } catch (err) {
    console.error('ERROR IN  STAKING ACCOUNT CHECK', err);
  }
  try {
    if (fs.existsSync(mainWalletfilePath)) {
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
