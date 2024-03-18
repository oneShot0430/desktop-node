import { show } from '@ebay/nice-modal-react';

import { TaskMetadata } from 'models';
import { Task } from 'renderer/types';

import { AddStake } from '../modals/AddStake';

type ParamsType = {
  task: Task;
  metadata?: TaskMetadata | null;
  onStakeActionSuccess?: () => Promise<unknown>;
};

export const useAddStakeModal = ({ task, metadata }: ParamsType) => {
  const showModal = () => {
    return show(AddStake, { task, metadata });
  };

  return {
    showModal,
  };
};
