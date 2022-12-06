import { show } from '@ebay/nice-modal-react';

import { EnterSecretModal } from './EnterSecretModal';

type ParamsType = {
  secretKeyName: string;
};

export const useShowEnterSecretModal = ({ secretKeyName }: ParamsType) => {
  const showModal = () => {
    return show(EnterSecretModal, { secretKeyName });
  };

  return {
    showModal,
  };
};
