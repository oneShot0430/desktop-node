import { show } from '@ebay/nice-modal-react';

import { ConfirmShowSecretModal } from './ConfirmShowSecretModal';

type ParamsType = {
  secretKeyName: string;
  secretValue: string;
  onReveal?: (pin: string) => void;
};

export const useShowSecretModal = ({
  secretKeyName,
  onReveal,
  secretValue,
}: ParamsType) => {
  const showModal = () => {
    show(ConfirmShowSecretModal, { secretKeyName, onReveal, secretValue });
  };

  return {
    showModal,
  };
};
