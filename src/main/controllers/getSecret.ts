import { Event } from 'electron';

import { Task } from 'models';
import { GetSecretParam } from 'models/api';
import koiiTasks from 'services/koiiTasks';

import mainErrorHandler from '../../utils/mainErrorHandler';

const getSecret = (event: Event, payload: GetSecretParam): Task[] => {
  const { tasksIds } = payload || {};
  const response = tasksIds.map((e) => koiiTasks.getTaskByPublicKey(e));
  return response;
};

export default mainErrorHandler(getSecret);
