import { Event } from 'electron';

import { namespaceInstance } from 'main/node/helpers/Namespace';
import { SetActiveAccountParam } from 'models/api';

const setActiveAccount = async (
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

export default setActiveAccount;
