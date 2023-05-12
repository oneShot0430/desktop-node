import { Event } from 'electron';

import { namespaceInstance } from 'main/node/helpers/Namespace';
import { SetActiveAccountParam } from 'models/api';

import { SystemDbKeys } from '../../config/systemDbKeys';
import { getMainSystemAccountKeypair } from '../node/helpers';

const setActiveAccount = async (
  event: Event,
  payload: SetActiveAccountParam
): Promise<boolean> => {
  const { accountName } = payload;
  console.log('Set Active Account', accountName);
  try {
    await namespaceInstance.storeSet(SystemDbKeys.ActiveAccount, accountName);

    const mainSystemAccountKeyPair = await getMainSystemAccountKeypair();

    // TODO: make "mainSystemAccount" in Task Node class dynamic
    namespaceInstance.mainSystemAccount = mainSystemAccountKeyPair;

    return true;
  } catch (err) {
    console.log('ERROR DURING SETTING ACTIVE ACCOUNT', err);
    return false;
  }
};

export default setActiveAccount;
