import { Icon, KeyUnlockLine, CloseLine } from '@_koii/koii-styleguide';
import { create, useModal } from '@ebay/nice-modal-react';
import { hash } from 'bcryptjs';
import React, { useMemo, useState } from 'react';

import { PinInput } from 'renderer/components/PinInput';
import { Button } from 'renderer/components/ui';
import { useCloseWithEsc } from 'renderer/features/common/hooks/useCloseWithEsc';
import { Modal, ModalContent } from 'renderer/features/modals';
import { useUserAppConfig } from 'renderer/features/settings/hooks/useUserAppConfig';
import { Theme } from 'renderer/types/common';

export const UpdatePinModal = create(function UpdatePinModal() {
  const { handleSaveUserAppConfig, isMutating } = useUserAppConfig({
    onConfigSaveSuccess: () => {
      modal.remove();
    },
  });
  const [focus, setFocus] = useState(true);
  const [pin, setPin] = useState('');
  const [pinConfirm, setPinConfirm] = useState('');
  const modal = useModal();

  const handlePinCreate = async () => {
    const saltRounds = 10;
    const hashedPin = await hash(pin, saltRounds);
    handleSaveUserAppConfig({
      settings: { pin: hashedPin, hasCopiedReferralCode: false },
    });
  };

  const handlePinSubmit = (pin: string) => {
    setFocus(false);
    setPin(pin);
  };

  const pinIsMatching = useMemo(() => pin === pinConfirm, [pin, pinConfirm]);
  const pinsLengtIsMatching = useMemo(
    () => pin.length === 6 && pinConfirm.length === 6,
    [pin, pinConfirm]
  );

  const handleClose = () => {
    modal.remove();
  };

  useCloseWithEsc({ closeModal: handleClose });

  console.log('@@@@isUserConfigLoading', isMutating);

  return (
    <Modal>
      <ModalContent
        theme={Theme.Dark}
        className="w-[680px] text-white pt-4 pb-6"
      >
        <div className="flex justify-between p-3">
          <div className="flex items-center justify-between pl-9">
            <Icon source={KeyUnlockLine} className="w-6 h-8 mr-5 text-white" />
            <span className="text-2xl">Update PIN</span>
          </div>
          <Icon
            source={CloseLine}
            className="w-8 h-8 cursor-pointer"
            onClick={handleClose}
          />
        </div>

        <div className="flex flex-col items-center justify-center mt-4">
          <div className="z-50 flex flex-col">
            <div className="mb-5 text-lg w-fit">Update your Access PIN.</div>
            <PinInput focus onComplete={handlePinSubmit} />
          </div>

          <div className="flex flex-col">
            <div className="mt-8 mb-5 text-lg w-fit">
              Confirm your Access PIN.
            </div>
            <PinInput
              focus={!pinConfirm && !focus}
              onChange={(pin) => setPinConfirm(pin)}
              key={pin}
            />
            <div className="pt-4 text-xs text-finnieOrange">
              {!pinIsMatching && pinsLengtIsMatching ? (
                <span>
                  Oops! These PINs don’t match. Double check it and try again.
                </span>
              ) : (
                <span>
                  If you forgot your PIN you’ll need to reimport your wallet.
                </span>
              )}
            </div>
          </div>

          <Button
            disabled={!pinIsMatching || !pinsLengtIsMatching || isMutating}
            label="Confirm PIN"
            onClick={handlePinCreate}
            className="py-2 mt-6 mr-3 bg-finnieGray-light text-finnieBlue w-60"
            loading={isMutating}
          />
        </div>
      </ModalContent>
    </Modal>
  );
});
