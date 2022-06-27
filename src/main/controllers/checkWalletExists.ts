import { Event } from 'electron';
import fs from 'fs';

import mainErrorHandler from '../../utils/mainErrorHandler';
import { namespaceInstance } from '../node/helpers/Namespace';

interface checkWalletParam {
  taskId: string;
}

const checkWallet = async (
  event: Event,
  payload: checkWalletParam
): Promise<unknown> => {
  console.log('IN THE API');
  const { taskId } = payload;
  let mainSystemAccount: boolean;
  let stakingWallet: boolean;
  const filePath = 'namespace/' + taskId + '/stakingWallet.json';
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
    const wallet = await namespaceInstance.redisGet('WALLET_LOCATION');
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
