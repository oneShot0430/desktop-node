import { CheckSuccessLine, CloseLine, Icon } from '@_koii/koii-styleguide';
import React from 'react';

import { ModalContent } from 'renderer/features/modals';
import { Theme } from 'renderer/types/common';

import { Steps, KeyType } from '../types';

import { AccountInfo } from './AccountInfo';

type PropsType = Readonly<{
  onClose: () => void;
  newKey: KeyType;
  setNextStep: (step: Steps) => void;
}>;

export function AccountCreated({ onClose, newKey }: PropsType) {
  return (
    <ModalContent theme={Theme.Dark} className="pb-7 pt-2 text-white w-[791px]">
      <div className="flex justify-between w-full p-3">
        <div className="flex items-center justify-between pl-6">
          <Icon
            source={CheckSuccessLine}
            className="w-8 h-8 m-2 text-finnieEmerald-light"
          />
          <span className="text-[24px] pl-5 text-white">
            New key successfully created!
          </span>
        </div>
        <Icon
          source={CloseLine}
          className="w-8 h-8 cursor-pointer"
          onClick={onClose}
        />
        {/*  not sure */}
      </div>

      <div className="px-12 tex-base text-left leading-8 mb-4">
        Keep your address at hand so you can easily fund your key and start
        running tasks. You can choose which account to use when running task in
        key management panel.
      </div>

      <div className="flex flex-col items-center justify-center gap-8 px-12  pb-3 w-[100%]">
        <AccountInfo
          accountName={newKey?.accountName}
          address={newKey?.system ?? ''}
        />
      </div>
    </ModalContent>
  );
}
