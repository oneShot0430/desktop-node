import { Event } from 'electron';

import { TaskStartStopParam } from 'models/api';
import koiiTasks from 'services/koiiTasks';

import mainErrorHandler from '../../utils/mainErrorHandler';

const stopTask = async (event: Event, payload: TaskStartStopParam) => {
  const { taskAccountPubKey } = payload;

  koiiTasks.taskStopped(taskAccountPubKey);
  return true;
};

export default mainErrorHandler(stopTask);
