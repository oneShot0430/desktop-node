import { show } from '@ebay/nice-modal-react';

import { AddTaskVariable } from '../modals/AddTaskVariable';

export const useAddTaskVariableModal = () => {
  const showModal = (): Promise<boolean> => {
    return show(AddTaskVariable);
  };

  return {
    showModal,
  };
};
