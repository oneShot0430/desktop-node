import { create, useModal } from '@ebay/nice-modal-react';
import React from 'react';

import KeyIconSvg from 'assets/svgs/key-icon-white.svg';
import CloseIconWhite from 'svgs/close-icons/close-icon-white.svg';
import { Button, PinInput } from 'webapp/components';
import { Modal, ModalContent } from 'webapp/features/modals';
import { Theme } from 'webapp/types/common';

type PropsType = {
  onReveal: () => void;
};

export const ConfirmShowAllSecretsModal = create<PropsType>(
  function ConfirmShowAllSecretsModal({ onReveal }) {
    const modal = useModal();

    return (
      <Modal>
        <ModalContent
          theme={Theme.Dark}
          className="px-12 text-white w-[800px] h-[480px] leading-8 relative"
        >
          <div className="flex flex-col h-full">
            <div className="flex items-center justify-between ">
              <div className="flex items-center justify-start">
                <KeyIconSvg />
                <div className="text-2xl py-7">Show All Secrets</div>
              </div>
              <CloseIconWhite
                className="w-[36px] h-[36px] cursor-pointer absolute right-3 top-3"
                onClick={() => modal.remove()}
              />
            </div>

            <div className="flex flex-col h-full">
              <div className="mx-2 mb-5 ">
                <div>
                  <div>
                    Reveal all your node’s secrets. Remember, these secrets are
                    for your eyes only.Anyone with a secret can interfere with
                    tasks and cause you to lose your stake.
                  </div>
                  <div className="mt-2 text-finnieTeal">Reveal All</div>
                </div>
              </div>
              <div>
                <div className="mb-4 ml-2">
                  Re-enter your PIN code to reveal the secret:
                </div>
                <div className="h-[80px] pl-7 bg-finnieBlue-light-tertiary border border-finnieTeal rounded flex items-center justify-start">
                  <PinInput
                    onChange={() => {
                      console.log('PIN CHANGED');
                    }}
                  />
                </div>
                <div className="mt-4 text-sm text-finnieRed">
                  Incorrect PIN code
                </div>
              </div>
            </div>

            <div className="flex justify-center mb-6">
              <Button
                label="Reveal Secret"
                className="font-semibold bg-finnieGray-light text-purple-3"
                onClick={() => {
                  onReveal();
                  modal.remove();
                }}
              />
            </div>
          </div>
        </ModalContent>
      </Modal>
    );
  }
);
