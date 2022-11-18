import { Event } from 'electron';

import * as readLastLines from 'read-last-lines';

import { ErrorType } from 'models';
import { GetTaskLogsParam, GetTaskLogsResponse } from 'models/api';
import { DetailedError } from 'utils';

import mainErrorHandler from '../../utils/mainErrorHandler';
import { getAppDataPath } from '../node/helpers/getAppDataPath';

const getTaskLogs = async (
  event: Event,
  payload: GetTaskLogsParam
): Promise<GetTaskLogsResponse> => {
  const { taskAccountPubKey, noOfLines } = payload;

  try {
    const contents = await readLastLines.read(
      getAppDataPath() + `/namespace/${taskAccountPubKey}/task.log`,
      noOfLines
    );
    return contents;
  } catch (e) {
    console.error(e);
    throw new DetailedError({
      detailed: e,
      summary:
        'There was an error collecting the Task information from Arweave. Try again or let us know about the issue.',
      type: ErrorType.NO_TASK_SOURCECODE,
    });
  }
};

export default mainErrorHandler(getTaskLogs);
