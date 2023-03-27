import { show } from '@ebay/nice-modal-react';

import { ConfirmNetworkSwitch, Props } from '../modals/ConfirmNetworkSwitch';

type ParamsType = Props;

export const useConfirmNetworkSwitchModal = ({
  onConfirm,
  onCancel,
}: ParamsType) => {
  const showModal = () => {
    show(ConfirmNetworkSwitch, { onConfirm, onCancel });
  };

  return {
    showModal,
  };
};
