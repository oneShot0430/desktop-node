import { show } from '@ebay/nice-modal-react';

import { ConfirmAccountDelete } from './ConfirmationModal';

import type { ConfirmationModalPropsType } from './ConfirmationModal';

type ParamsType = ConfirmationModalPropsType;

export const useConfirmModal = ({ accountName }: ParamsType) => {
  const showModal = () => {
    return show(ConfirmAccountDelete, { accountName });
  };

  return {
    showModal,
  };
};
