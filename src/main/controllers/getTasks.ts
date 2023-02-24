import { Event } from 'electron';

import { Task } from 'models';
import { FetchAllTasksParam } from 'models/api';

import fetchAlltasks from './fetchAlltasks';

const getTasks = async (
  event: Event,
  payload: FetchAllTasksParam
): Promise<Task[]> => fetchAlltasks(event, payload);

export default getTasks;
