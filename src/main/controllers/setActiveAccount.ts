import { Event } from 'electron';

import { SetActiveAccountParam } from 'models';

import mainErrorHandler from '../../utils/mainErrorHandler';
import { namespaceInstance } from '../node/helpers/Namespace';

const storeWallet = async (
  event: Event,
  payload: SetActiveAccountParam
): Promise<boolean> => {
  const { accountName } = payload;
  console.log('Set Active Account', accountName);
  try {
    const ACTIVE_ACCOUNT = 'ACTIVE_ACCOUNT';
    await namespaceInstance.storeSet(ACTIVE_ACCOUNT, accountName);
    return true;
  } catch (err) {
    console.log('ERROR', err);
    return false;
  }
};

export default mainErrorHandler(storeWallet);
