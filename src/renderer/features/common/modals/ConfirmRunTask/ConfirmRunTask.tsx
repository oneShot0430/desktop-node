import { Icon, CloseLine } from '@_koii/koii-styleguide';
import { create, useModal } from '@ebay/nice-modal-react';
import React from 'react';

import ExclamationMarkIcon from 'assets/svgs/exclamation-mark-icon.svg';
import { ROE } from 'models';
import { Button } from 'renderer/components/ui';
import { useCloseWithEsc } from 'renderer/features/common/hooks/useCloseWithEsc';
import { Modal, ModalContent } from 'renderer/features/modals';
import { Theme } from 'renderer/types/common';
import { getKoiiFromRoe } from 'utils';

export type PropsType = {
  taskName: string;
  stake: ROE;
  onConfirm: () => void;
};

export const ConfirmRunTask = create<PropsType>(function ConfirmRunTask({
  taskName,
  stake,
  onConfirm,
}) {
  const modal = useModal();

  const handleConfirm = () => {
    onConfirm();
    modal.remove();
  };

  useCloseWithEsc({ closeModal: modal.remove });

  const stakeInKoii = getKoiiFromRoe(stake);

  return (
    <Modal>
      <ModalContent
        theme={Theme.Dark}
        className="text-left px-7 py-5 h-fit rounded text-white flex flex-col gap-4 w-[586px]"
      >
        <div className="flex items-center justify-center w-full gap-4 pt-2 text-2xl font-semibold">
          <Icon source={ExclamationMarkIcon} className="w-11 h-11 text-white" />
          <span>Confirm to Run</span>
          <Icon
            source={CloseLine}
            className="w-8 h-8 ml-auto cursor-pointer"
            onClick={modal.remove}
          />
        </div>

        <p className="my-3 mx-auto">
          Are you sure you want to run <strong>{taskName}</strong>?
        </p>

        <Button
          label="Run Task"
          className="w-56 h-12 m-auto font-semibold bg-finnieGray-tertiary text-finnieBlue-light"
          onClick={handleConfirm}
        />

        <p className="text-sm font-light text-finnieEmerald-light my-3 mx-auto">
          Current Stake: {stakeInKoii} KOII
        </p>
      </ModalContent>
    </Modal>
  );
});
