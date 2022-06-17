import { Event } from 'electron';


import koiiState from 'services/koiiState';

import mainErrorHandler from '../../utils/mainErrorHandler';

type StopTaskPayload = {
    taskAccountPubKey: string
}

const stopTask = (event: Event, payload: StopTaskPayload) => {

    return true;
};

export default mainErrorHandler(stopTask);
