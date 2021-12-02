import { Event } from 'electron';


import koiiState from 'services/koiiState';

import mainErrorHandler from '../../utils/mainErrorHandler';

const getTasks = (event: Event, payload: any) => koiiState.getTasks();

export default mainErrorHandler(getTasks);
