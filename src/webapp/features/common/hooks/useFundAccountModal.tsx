import { show } from '@ebay/nice-modal-react';

import { AddFunds } from '../modals/AddFunds';

export const useFundNewAccountModal = () => {
  const showFundNewAccountModal = () => {
    return show(AddFunds);
  };

  return {
    showFundNewAccountModal,
  };
};
