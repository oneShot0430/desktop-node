import { show } from '@ebay/nice-modal-react';

import { TaskVariableData } from 'models/api';

import { EditTaskVariable } from '../modals/EditTaskVariable';

export const useEditTaskVariable = (taskVariable: TaskVariableData) => {
  const showModal = () => {
    show(EditTaskVariable, { taskVariable });
  };

  return {
    showModal,
  };
};
