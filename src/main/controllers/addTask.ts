import { Event } from 'electron';

import koiiState from 'services/koiiState';
import { DetailedError, ErrorType } from 'utils';

import mainErrorHandler from '../../utils/mainErrorHandler';

type AddTaskPayload = {
  contractId: string;
};

const addTask = (event: Event, payload: AddTaskPayload) => {
  const { contractId } = payload;

  if (!contractId) {
    throw new DetailedError({
      detailed: 'ContractId not found',
      summary: 'Something went wrong. Please try again',
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
