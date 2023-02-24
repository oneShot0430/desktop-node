import { show } from '@ebay/nice-modal-react';

import { Task } from 'webapp/types';

import { EditStakeAmount } from '../modals/EditStakeAmount';

type ParamsType = {
  task: Task;
};

export const useEditStakeAmountModal = ({ task }: ParamsType) => {
  const showModal = () => {
    show(EditStakeAmount, { task });
  };

  return {
    showModal,
  };
};
