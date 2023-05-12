import { show } from '@ebay/nice-modal-react';

import { Task } from 'renderer/types';

import { AddStake } from '../modals/AddStake';

type ParamsType = {
  task: Task;
  onStakeActionSuccess?: () => Promise<unknown>;
};

export const useAddStakeModal = ({ task }: ParamsType) => {
  const showModal = () => {
    return show(AddStake, { task });
  };

  return {
    showModal,
  };
};
