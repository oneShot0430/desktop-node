import { show } from '@ebay/nice-modal-react';

import { TaskVariableData } from 'models/api';

import { InspectTaskVariable } from '../modals/InspectTaskVariable';

export const useInspectTaskVariable = (taskVariable: TaskVariableData) => {
  const showModal = () => {
    show(InspectTaskVariable, { taskVariable });
  };

  return {
    showModal,
  };
};
