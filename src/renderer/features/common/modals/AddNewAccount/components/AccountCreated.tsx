import React from 'react';

import { ReactComponent as CheckmarkTealSvg } from 'assets/svgs/checkmark-teal-icon.svg';
import { ReactComponent as CloseIconWhite } from 'assets/svgs/close-icons/close-icon-white.svg';
import { ModalContent } from 'renderer/features/modals';
import { Theme } from 'renderer/types/common';

import { Steps, KeysType } from '../types';

import { AccountInfo } from './AccountInfo';

type PropsType = Readonly<{
  onClose: () => void;
  newKeys: KeysType;
  setNextStep: (step: Steps) => void;
}>;

export function AccountCreated({ onClose, newKeys }: PropsType) {
  return (
    <ModalContent theme={Theme.Dark} className="pb-6 text-white w-[680px]">
      <div className="flex justify-between w-full p-3">
        <div className="flex items-center justify-between pl-6">
          <CheckmarkTealSvg width={96} height={97} />
          <span className="text-[24px] pl-5 text-white">
            New key successfully created!
          </span>
        </div>

        <CloseIconWhite className="w-[32px] h-[32px]" onClick={onClose} />
      </div>

      <div className="px-[62px] text-left leading-8 mb-4">
        Here are your new keys! You can select which keys to use in the key
        management settings.
      </div>

      <div className="flex flex-col items-center justify-center gap-8 px-12 w-[100%]">
        <AccountInfo keyType="system" address={newKeys?.system ?? ''} />
        <AccountInfo keyType="task" address={newKeys?.task ?? ''} />
      </div>
    </ModalContent>
  );
}
