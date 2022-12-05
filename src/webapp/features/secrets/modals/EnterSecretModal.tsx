import { create, useModal } from '@ebay/nice-modal-react';
import React, { useState } from 'react';

import CheckMarkIcon from 'assets/svgs/checkmark-icon.svg';
import KeyIconSvg from 'assets/svgs/key-icon-white.svg';
import CloseIconWhite from 'svgs/close-icons/close-icon-white.svg';
import { Button } from 'webapp/components';
import { Modal, ModalContent } from 'webapp/features/modals';
import { Theme } from 'webapp/types/common';

type PropsType = {
  secretKeyName: string;
  secretValue: string;
  onPinChange: (pin: string) => void;
  onReveal?: () => void;
};

export const EnterSecretModal = create<PropsType>(function EnterSecretModal({
  secretKeyName,
}) {
  const modal = useModal();
  const [secret, setSecret] = useState('');

  const onSecretConfirm = () => {
    modal.resolve(secret);
    modal.remove();
  };

  const onChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setSecret(e.target.value);
  };

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
              <div className="text-2xl py-7">
                <span>
                  Show
                  <span className="text-finnieTeal">{secretKeyName}</span>
                  Private Key Secret
                </span>
              </div>
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
                  After completing the steps , enter the secret in the box
                  below. Don’t share this secret. Anyone with a secret can
                  interfere with the task and cause you to lose your stake.
                </div>
                <div className="mt-2 text-finnieTeal">{secretKeyName}</div>
              </div>
            </div>

            <textarea
              onChange={onChange}
              className="h-[180px] resize-none pl-7 bg-finnieBlue-light-tertiary border border-finnieTeal rounded flex items-center justify-start"
            />
          </div>

          <div className="flex justify-center mb-6">
            <Button
              label="Finish & Run Task"
              className="text-sm font-semibold bg-finnieGray-light text-purple-3 w-[200px] h-[36px]"
              onClick={onSecretConfirm}
              icon={<CheckMarkIcon className="text-purple-3 w-[12px]" />}
            />
          </div>
        </div>
      </ModalContent>
    </Modal>
  );
});
