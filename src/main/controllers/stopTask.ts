import { Event } from 'electron';

import koiiTasks from 'services/koiiTasks';

import mainErrorHandler from '../../utils/mainErrorHandler';

type StopTaskPayload = {
  taskAccountPubKey: string;
};

const stopTask = async (event: Event, payload: StopTaskPayload) => {
  const { taskAccountPubKey } = payload;

  koiiTasks.taskStopped(taskAccountPubKey);
  return true;
};

export default mainErrorHandler(stopTask);
