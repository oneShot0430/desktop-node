import { show } from '@ebay/nice-modal-react';

import { AddTaskVariable } from '../modals/AddTaskVariable';

export const useAddTaskVariable = () => {
  const showModal = () => {
    show(AddTaskVariable);
  };

  return {
    showModal,
  };
};
