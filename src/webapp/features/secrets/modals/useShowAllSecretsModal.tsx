import { show } from '@ebay/nice-modal-react';

import { ConfirmShowAllSecretsModal } from './ConfirmShowAllSecretsModal';

type PropsType = {
  onReveal: () => void;
};

export const useShowAllSecretsModal = ({ onReveal }: PropsType) => {
  const showModal = () => {
    show(ConfirmShowAllSecretsModal, { onReveal });
  };

  return {
    showModal,
  };
};
