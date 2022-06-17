import { Event } from 'electron';

import koiiTasks from 'services/koiiTasks';

import mainErrorHandler from '../../utils/mainErrorHandler';

const getTasks = (event: Event, payload: any) => koiiTasks.getAllTasks();

export default mainErrorHandler(getTasks);
