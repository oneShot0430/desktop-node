import { create, useModal } from '@ebay/nice-modal-react';
import React from 'react';
import { useNavigate } from 'react-router-dom';

import { Button } from 'webapp/components/ui';
import { useFundNewAccountModal } from 'webapp/features/common/hooks/useFundAccountModal';
import { useUserAppConfig } from 'webapp/features/common/hooks/useUserAppConfig';
import { Modal, ModalContent, ModalTopBar } from 'webapp/features/modals';
import { Theme } from 'webapp/types/common';
import { AppRoute } from 'webapp/types/routes';

export const NotEnoughFunds = create(function NotEnoughFunds() {
  const modal = useModal();
  const navigate = useNavigate();

  const { handleSaveUserAppConfig } = useUserAppConfig({
    onConfigSaveSuccess: () => {
      modal.remove();
      navigate(AppRoute.MyNode, { state: { noBackButton: true } });
    },
  });
  const { showModal: showFundNewAccountModal } = useFundNewAccountModal(
    modal.show
  );

  const handleFundMyKey = () => {
    modal.remove();
    showFundNewAccountModal();
  };

  const handleSkipRunTasks = () =>
    handleSaveUserAppConfig({ settings: { onboardingCompleted: true } });

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
            <p className="text-xl font-semibold text-white">
              Do you want to fund your account to
              <br /> run these tasks?
            </p>
          </div>

          <div className="flex justify-center gap-4">
            <Button
              label="Skip Run Tasks"
              className="border bg-finnieRed text-finnieBlue border-finnieBlue"
              onClick={handleSkipRunTasks}
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
