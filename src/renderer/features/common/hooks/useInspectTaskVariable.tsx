import { show } from '@ebay/nice-modal-react';

import { TaskVariableDataWithId } from 'models/api';

import { InspectTaskVariable } from '../modals/InspectTaskVariable';

export const useInspectTaskVariable = (
  taskVariable: TaskVariableDataWithId
) => {
  const showModal = () => {
    show(InspectTaskVariable, { taskVariable });
  };

  return {
    showModal,
  };
};
