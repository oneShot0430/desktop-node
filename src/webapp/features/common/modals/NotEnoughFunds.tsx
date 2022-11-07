import { create, useModal } from '@ebay/nice-modal-react';
import React from 'react';
import { useNavigate } from 'react-router-dom';

import { Button } from 'webapp/components';
import { useFundNewAccountModal } from 'webapp/features/common';
import { Modal, ModalContent, ModalTopBar } from 'webapp/features/modals';
import { AppRoute } from 'webapp/routing/AppRoutes';
import { Theme } from 'webapp/types/common';

export const NotEnoughFunds = create(function NotEnoughFunds() {
  const modal = useModal();
  const navigate = useNavigate();

  const { showModal: showFundNewAccountModal } = useFundNewAccountModal(
    modal.show
  );

  const handleFundMyKey = () => {
    modal.remove();
    showFundNewAccountModal();
  };

  return (
    <Modal>
      <ModalContent theme={Theme.Dark}>
        <ModalTopBar
          theme="dark"
          title="Not Enough Funds"
          onClose={modal.remove}
        />

        <div className="p-8">
          <div className="flex items-center justify-center h-full mb-11">
            <p className="text-xl text-white font-semibold">
              Do you want to fund your account to
              <br /> run these tasks?
            </p>
          </div>

          <div className="flex justify-center gap-4">
            <Button
              label="Skip Run Tasks"
              className="border bg-finnieRed text-finnieBlue border-finnieBlue"
              onClick={() => {
                modal.remove();
                navigate(AppRoute.MyNode);
              }}
            />
            <Button
              label="Fund my Key"
              className="bg-white"
              onClick={handleFundMyKey}
            />
          </div>
        </div>
      </ModalContent>
    </Modal>
  );
});
