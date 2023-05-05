import { show } from '@ebay/nice-modal-react';

import { Task } from 'renderer/types';

import { EditStakeAmount } from '../modals/EditStakeAmount';

type ParamsType = {
  task: Task;
  onStakeActionSuccess?: () => Promise<unknown>;
};

export const useEditStakeAmountModal = ({
  task,
  onStakeActionSuccess,
}: ParamsType) => {
  const showModal = () => {
    show(EditStakeAmount, { task, onStakeActionSuccess });
  };

  return {
    showModal,
  };
};
