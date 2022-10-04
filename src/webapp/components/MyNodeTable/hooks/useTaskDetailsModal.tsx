import { show } from '@ebay/nice-modal-react';

import { Task } from 'webapp/types';

import { TaskDetailsModal } from '../components/modals/TaskDetailsModal';

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
