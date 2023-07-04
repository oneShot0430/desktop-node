import { shell } from 'electron';
import { join } from 'path';

import { getAppDataPath } from 'main/node/helpers/getAppDataPath';
import { ErrorType } from 'models';
import { throwDetailedError } from 'utils';

const FAILED_TO_OPEN = 'Failed to open path';

export const getMainLogs = async (event: Event): Promise<boolean> => {
  try {
    const logfilePath = join(getAppDataPath(), 'logs', 'main.log');
    const result = await shell.openPath(logfilePath);

    if (result === FAILED_TO_OPEN) throw new Error('file not found');
    return true;
  } catch (err: any) {
    console.error(err);
    return throwDetailedError({
      detailed: err,
      type: ErrorType.GENERIC,
    });
  }
};
