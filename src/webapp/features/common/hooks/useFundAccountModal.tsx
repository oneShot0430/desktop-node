import { show } from '@ebay/nice-modal-react';

import { AddFunds } from '../modals/AddFunds';

export const useFundNewAccountModal = (onGoBack?: () => void) => {
  const showModal = () => {
    return show(AddFunds, { onGoBack });
  };

  return {
    showModal,
  };
};
