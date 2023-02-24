import { create, useModal } from '@ebay/nice-modal-react';
import React, { ReactNode } from 'react';

import { Button } from 'webapp/components/ui';
import { Modal, ModalContent, ModalTopBar } from 'webapp/features/modals';

export type ConfirmationModalPropsType = {
  title: string;
  content: ReactNode;
};

export const ConfirmAccountDelete = create<ConfirmationModalPropsType>(
  function ConfirmAccountDelete({ content, title }) {
    const modal = useModal();

    const handleClose = () => {
      modal.resolve();
      modal.remove();
    };

    const handleConfirm = () => {
      modal.resolve(true);
      modal.remove();
    };

    return (
      <Modal>
        <ModalContent className="pt-2 w-fit h-fit text-finnieBlue rounded-xl">
          <ModalTopBar
            title={title}
            onClose={handleClose}
            titleClasses="text-finnieBlue"
          />
          {content}
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
