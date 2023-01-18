import { Event } from 'electron';

import { Task } from '../../models';
import { FetchAllTasksParam } from '../../models/api';

import mainErrorHandler from '../../utils/mainErrorHandler';

import fetchAlltasks from './fetchAlltasks';

const getTasks = (event: Event, payload: FetchAllTasksParam): Task[] =>
  fetchAlltasks(event, payload);

export default mainErrorHandler(getTasks);
