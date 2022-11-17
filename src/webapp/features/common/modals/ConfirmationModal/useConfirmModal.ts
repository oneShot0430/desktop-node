import { show } from '@ebay/nice-modal-react';

import { ConfirmAccountDelete } from './ConfirmationModal';

import type { ConfirmationModalPropsType } from './ConfirmationModal';

type ParamsType = ConfirmationModalPropsType;

export const useConfirmModal = ({ content, title }: ParamsType) => {
  const showModal = () => {
    return show(ConfirmAccountDelete, { content, title });
  };

  return {
    showModal,
  };
};
