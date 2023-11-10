import { show } from '@ebay/nice-modal-react';

import {
  AddStakingAccountFunds,
  type PropsType as AddStakingAccountFundsProps,
} from '../modals/AddStakingAccountFunds';

export const useFundStakingAccountModal = ({
  onWalletFundSuccess,
}: AddStakingAccountFundsProps) => {
  const showModal = () => {
    return show(AddStakingAccountFunds, {
      onWalletFundSuccess,
    });
  };

  return {
    showModal,
  };
};
