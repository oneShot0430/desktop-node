import { show } from '@ebay/nice-modal-react';

import { AddFunds, Props as AddFundsProps } from '../modals/AddFunds';

export const useFundNewAccountModal = ({
  accountPublicKey,
  onGoBack,
}: AddFundsProps = {}) => {
  const showModal = () => {
    return show(AddFunds, { accountPublicKey, onGoBack });
  };

  return {
    showModal,
  };
};
