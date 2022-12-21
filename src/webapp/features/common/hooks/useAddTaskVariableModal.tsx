import { show } from '@ebay/nice-modal-react';

import { AddTaskVariable } from '../modals/AddTaskVariable';

export const useAddTaskVariableModal = () => {
  const showModal = () => {
    show(AddTaskVariable);
  };

  return {
    showModal,
  };
};
