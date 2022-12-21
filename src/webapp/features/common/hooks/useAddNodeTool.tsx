import { show } from '@ebay/nice-modal-react';

import { AddNodeTool } from '../modals/AddNodeTool';

export const useAddNodeTool = () => {
  const showModal = () => {
    show(AddNodeTool);
  };

  return {
    showModal,
  };
};
