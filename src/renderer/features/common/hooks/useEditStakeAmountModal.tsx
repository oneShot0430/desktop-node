import { show } from '@ebay/nice-modal-react';

import { Task } from 'renderer/types';

import { EditStakeAmount } from '../modals';

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
