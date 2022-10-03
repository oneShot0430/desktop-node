import { create, useModal } from '@ebay/nice-modal-react';
import React from 'react';

import Link from 'webapp/components/Link';
import { Modal, ModalContent, ModalTopBar } from 'webapp/features/modals';

export const CreateTaskModal = create(function CreateTaskModal() {
  const modal = useModal();

  const handleClose = () => {
    modal.remove();
  };

  return (
    <Modal>
      <ModalContent>
        <ModalTopBar title={'Create New Task'} onClose={handleClose} />
        <div className="flex flex-col items-center pt-4 text-finnieBlue tracking-finnieSpacing-wider">
          <div className="text-2xl font-semibold  mb-2.5 leading-8">
            Create your own Koii Tasks
          </div>
          <div className="font-normal w-128 mb-6.25">
            The world&aposs information is at your fingertips with the power of
            the Koii Network.
          </div>
          <div className="mb-1 font-semibold leading-7">
            Are you a developer?
          </div>
          <div className="font-normal mb-2.5">
            Head over to the <Link to="#" text="Koii SDK" /> to learn how.
          </div>
          <div className="mb-1 font-semibold leading-7">Need a developer?</div>
          <div className="font-normal w-128">
            Check out our <Link to="#" text="Discord server" /> to find
            developers who are already familiar with Koii and creating Tasks.
          </div>
        </div>
      </ModalContent>
    </Modal>
  );
});
