import { Event } from 'electron';

import { ErrorType } from '../../models';
import koiiState from '../../services/koiiState';
import { throwDetailedError } from '../../utils';
import mainErrorHandler from '../../utils/mainErrorHandler';

type AddTaskPayload = {
  contractId: string;
};

const addTask = (event: Event, payload: AddTaskPayload) => {
  const { contractId } = payload;

  if (!contractId) {
    return throwDetailedError({
      detailed: 'ContractId not found',
      type: ErrorType.CONTRACT_ID_NOT_FOUND,
    });
  }

  const addedTasks = koiiState.getAddedTasks();

  const newTask = {
    contractId,
    activated: false,
  };

  addedTasks.push(newTask);
  koiiState.setAddedTasks(addedTasks);

  return true;
};

export default mainErrorHandler(addTask);
