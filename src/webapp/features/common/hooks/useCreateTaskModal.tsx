import { show } from '@ebay/nice-modal-react';

import { CreateTaskModal } from '../modals';

export const useCreateTaskModal = () => {
  const showTaskDetailsModal = () => {
    show(CreateTaskModal);
  };

  return {
    showTaskDetailsModal,
  };
};
