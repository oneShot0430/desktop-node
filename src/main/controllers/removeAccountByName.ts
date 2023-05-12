import { Event } from 'electron';
import fs from 'fs';

import { RemoveAccountByNameParam } from 'models/api';

import { ErrorType } from '../../models';
import { throwDetailedError } from '../../utils';
import { getAppDataPath } from '../node/helpers/getAppDataPath';

const removeAccountByName = async (
  event: Event,
  payload: RemoveAccountByNameParam
): Promise<boolean> => {
  const { accountName } = payload;
  try {
    fs.unlinkSync(
      `${getAppDataPath()}/namespace/${accountName}_stakingWallet.json`
    );
    fs.unlinkSync(
      `${getAppDataPath()}/wallets/${accountName}_mainSystemWallet.json`
    );
    return true;
  } catch (err: any) {
    console.log('ERROR REMOVE ACCOUNT', err);
    return throwDetailedError({
      detailed: err,
      type: ErrorType.GENERIC,
    });
  }
};

export default removeAccountByName;
