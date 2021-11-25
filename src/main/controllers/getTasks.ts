import { Event } from 'electron';

import mainErrorHandler from '../../utils/mainErrorHandler';

const getTasks = (event: Event, payload: any) => {
  return [
    {taskName: 'Attention Game', contractId: 'aaaaaaaaaaa'},
    {taskName: 'Attention Game 1', contractId: 'bbbbbbbbbbbbb'}
  ];
};

export default mainErrorHandler(getTasks);
