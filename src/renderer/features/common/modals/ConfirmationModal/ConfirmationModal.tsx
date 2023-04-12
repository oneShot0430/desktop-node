import { create, useModal } from '@ebay/nice-modal-react';
import React, { ReactNode } from 'react';

import { Button } from 'renderer/components/ui';
import { Modal, ModalContent, ModalTopBar } from 'renderer/features/modals';

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
        <ModalContent className="w-fit h-fit text-finnieBlue rounded-md">
          <ModalTopBar
            title={title}
            onClose={handleClose}
            titleClasses="text-finnieBlue"
          />
          {content}
          <div className="px-16 pb-5">
            <div className="flex items-center justify-between gap-20">
              <Button
                label="Delete"
                onClick={handleConfirm}
                variant="danger"
                className="bg-finnieRed text-finnieBlue-light-secondary rounded-md"
              />
              <Button
                label="Cancel"
                onClick={handleClose}
                className="text-white rounded-md"
              />
            </div>
          </div>
        </ModalContent>
      </Modal>
    );
  }
);
