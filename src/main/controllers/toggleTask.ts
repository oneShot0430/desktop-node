import { Event } from 'electron';


import koiiState from 'services/koiiState';

import mainErrorHandler from '../../utils/mainErrorHandler';

type ToggleTaskPayload = {
  contractId: string
}

const toggleTask = (event: Event, payload: ToggleTaskPayload) => {
  const { contractId } = payload;

  if (!contractId) throw new Error('ContractId not found');

  const addedTasks = koiiState.getAddedTasks();

  for (const task of addedTasks) {
    if (task.contractId === contractId) task.activated = !task.activated;
  }

  koiiState.setAddedTasks(addedTasks);
  return true;
};

export default mainErrorHandler(toggleTask);
