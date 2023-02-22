import { Event } from 'electron';
import fs from 'fs';

import { ErrorType } from '../../models';
import { CheckWalletExistsResponse } from '../../models/api';
import { throwDetailedError } from '../../utils';
import mainErrorHandler from '../../utils/mainErrorHandler';
import { getAppDataPath } from '../node/helpers/getAppDataPath';
import { namespaceInstance } from '../node/helpers/Namespace';

const checkWallet = async (
  event: Event
): Promise<CheckWalletExistsResponse> => {
  console.log('Check Wallet');
  let mainSystemAccount = false;
  let stakingWallet = false;
  const activeAccount = await namespaceInstance.storeGet('ACTIVE_ACCOUNT');

  if (!activeAccount) {
    return throwDetailedError({
      detailed: 'Please select an active account',
      type: ErrorType.NO_ACTIVE_ACCOUNT,
    });
  }

  const stakingWalletfilePath = `${getAppDataPath()}/namespace/${activeAccount}_stakingWallet.json`;
  const mainWalletfilePath = `${getAppDataPath()}/wallets/${activeAccount}_mainSystemWallet.json`;

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
    mainSystemAccount,
    stakingWallet,
  };
  return check;
};

export default mainErrorHandler(checkWallet);
