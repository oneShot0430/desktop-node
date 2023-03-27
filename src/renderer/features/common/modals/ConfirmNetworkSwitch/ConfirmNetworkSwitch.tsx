import { create, useModal } from '@ebay/nice-modal-react';
import React from 'react';

import { Button } from 'renderer/components/ui';
import { Modal, ModalContent, ModalTopBar } from 'renderer/features/modals';

export interface Props {
  onConfirm: () => Promise<void>;
  onCancel: () => void;
  newNetwork: string;
}

export const ConfirmNetworkSwitch = create<Props>(
  function ConfirmNetworkSwitch({ onConfirm, onCancel, newNetwork }) {
    const modal = useModal();

    const handleClose = () => {
      onCancel();
      modal.resolve();
      modal.remove();
    };

    const handleConfirm = async () => {
      await onConfirm();
      modal.resolve(true);
      modal.remove();
    };

    return (
      <Modal>
        <ModalContent className="p-4 w-fit h-fit text-finnieBlue rounded-xl">
          <ModalTopBar
            title="Restart to Change Networks"
            onClose={handleClose}
            titleClasses="text-finnieBlue"
          />
          <div className="p-4 pb-8">
            {' '}
            The node will restart when you switch networks. Are you sure you
            want to change to {newNetwork}?
          </div>

          <div className="flex items-center justify-center gap-4">
            <Button
              label="Cancel"
              onClick={handleClose}
              variant="danger"
              className="bg-finnieRed text-finnieBlue-light-secondary"
            />
            <Button
              label="Confirm"
              onClick={handleConfirm}
              className="text-white"
            />
          </div>
        </ModalContent>
      </Modal>
    );
  }
);
