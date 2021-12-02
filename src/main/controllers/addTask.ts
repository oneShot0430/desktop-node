import { Event } from 'electron';


import koiiState from 'services/koiiState';

import mainErrorHandler from '../../utils/mainErrorHandler';

type AddTaskPayload = {
  contractId: string
}

const addTask = (event: Event, payload: AddTaskPayload) => {
  const { contractId } = payload;

  if (!contractId) throw new Error('ContractId not found');

  const addedTasks = koiiState.getAddedTasks();

  const newTask = {
    contractId,
    activated: false
  };

  addedTasks.push(newTask);
  koiiState.setAddedTasks(addedTasks);

  return true;
};

export default mainErrorHandler(addTask);
