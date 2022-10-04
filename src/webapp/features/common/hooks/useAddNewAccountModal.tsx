import { show } from '@ebay/nice-modal-react';

import { AddNewAccount } from '../modals';

export const useAddNewAccountModal = () => {
  const showModal = () => {
    show(AddNewAccount);
  };

  return {
    showModal,
  };
};
