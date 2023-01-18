import { show } from '@ebay/nice-modal-react';

import { Task } from 'renderer/types';

import { TaskDetailsModal } from '../modals';

type ParamsType = {
  task: Task;
  accountPublicKey: string;
};

export const useTaskDetailsModal = ({ task, accountPublicKey }: ParamsType) => {
  const showModal = () => {
    show(TaskDetailsModal, { task, accountPublicKey });
  };

  return {
    showModal,
  };
};
