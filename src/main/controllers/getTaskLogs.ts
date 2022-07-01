import { Event } from 'electron';

import * as readLastLines from 'read-last-lines';

import { GetTaskLogsParam } from 'models';

import mainErrorHandler from '../../utils/mainErrorHandler';

const getTaskLogs = async (
  event: Event,
  payload: GetTaskLogsParam
): Promise<string> => {
  const { taskAccountPubKey, noOfLines } = payload;

  try {
    const contents = await readLastLines.read(
      `namespace/${taskAccountPubKey}/task.log`,
      noOfLines
    );
    return contents;
  } catch (err) {
    console.error(err);
    throw new Error('Get task source error');
  }
};

export default mainErrorHandler(getTaskLogs);
