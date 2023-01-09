import { show } from '@ebay/nice-modal-react';

import { TaskVariableData } from 'models/api';

import { DeleteTaskVariable } from '../modals/DeleteTaskVariable';

export const useDeleteTaskVariable = (
  taskVariableLabel: TaskVariableData['label']
) => {
  const showModal = () => {
    show(DeleteTaskVariable, { taskVariableLabel });
  };

  return {
    showModal,
  };
};
