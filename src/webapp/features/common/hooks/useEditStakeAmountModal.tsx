import { show } from '@ebay/nice-modal-react';

import { Task } from 'webapp/types';

import { EditStakeAmount } from '../modals';

type ParamsType = {
  task: Task;
};

export const useEditStakeAmountModal = ({ task }: ParamsType) => {
  const showEditStakeAmountModal = () => {
    show(EditStakeAmount, { task });
  };

  return {
    showEditStakeAmountModal,
  };
};
