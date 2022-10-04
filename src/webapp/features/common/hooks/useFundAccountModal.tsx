import { show } from '@ebay/nice-modal-react';

import { AddFunds } from '../modals/AddFunds';

export const useFundNewAccountModal = () => {
  const showModal = () => {
    return show(AddFunds);
  };

  return {
    showModal,
  };
};
