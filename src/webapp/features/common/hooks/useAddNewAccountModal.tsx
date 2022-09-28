import { show } from '@ebay/nice-modal-react';

import { AddNewAccount } from '../modals';

export const useAddNewAccountModal = () => {
  const showAddNewAccountModal = () => {
    show(AddNewAccount);
  };

  return {
    showAddNewAccountModal,
  };
};
