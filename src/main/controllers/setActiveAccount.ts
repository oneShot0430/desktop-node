import { Event } from 'electron';

import { namespaceInstance } from 'main/node/helpers/Namespace';
import { SetActiveAccountParam } from 'models/api';

import mainErrorHandler from '../../utils/mainErrorHandler';

const storeWallet = async (
  event: Event,
  payload: SetActiveAccountParam
): Promise<boolean> => {
  console.log('IN THE API');
  const { accountName } = payload;
  try {
    const ACTIVE_ACCOUNT = 'ACTIVE_ACCOUNT';
    await namespaceInstance.storeSet(ACTIVE_ACCOUNT, accountName);
    return true;
  } catch (err) {
    console.log('ERROR', err);
  }
};

export default mainErrorHandler(storeWallet);
