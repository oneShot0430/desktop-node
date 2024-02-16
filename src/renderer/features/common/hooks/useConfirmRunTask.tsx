import { show } from '@ebay/nice-modal-react';

import { ConfirmRunTask, PropsType } from '../modals/ConfirmRunTask';

export const useConfirmRunTask = ({
  taskName,
  stake,
  onConfirm,
}: PropsType) => {
  const showModal = () => {
    show(ConfirmRunTask, { taskName, stake, onConfirm });
  };

  return {
    showModal,
  };
};
