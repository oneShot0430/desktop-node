import React, { memo, useEffect, useRef } from 'react';

import AddIcon from 'assets/svgs/add-icon-outlined.svg';
import UploadIcon from 'assets/svgs/upload-icon.svg';
import { ModalContent, ModalTopBar } from 'renderer/features/modals';
import { Theme } from 'renderer/types/common';

import { Steps } from '../AddNewAccount';

import { AddAccountAction } from './AddAccountAction';

type PropsType = Readonly<{
  onClose: () => void;
  setNextStep: (step: Steps) => void;
}>;

const ImportAccount = ({ onClose, setNextStep }: PropsType) => {
  const ref = useRef(null);

  useEffect(() => {
    if (ref.current) {
      ref.current.focus();
    }
  });

  return (
    <ModalContent theme={Theme.Dark} className="w-[800px] h-[320px]">
      <ModalTopBar theme="dark" title={'Key Management'} onClose={onClose} />
      <div className="flex flex-col items-start gap-2 pt-4 pl-12">
        <div className="text-xl font-semibold text-white">Add New Account</div>
        <AddAccountAction
          onClick={() => setNextStep(Steps.ImportWithKeyPhrase)}
          ref={ref}
          title="Import with a seed phrase"
          description="Import an existing wallet using a 12-word seed phrase"
          icon={<UploadIcon />}
        />

        <AddAccountAction
          onClick={() => setNextStep(Steps.CreateNewKey)}
          title="Get a new key"
          description="Start from the beginning"
          icon={<AddIcon />}
        />
      </div>
    </ModalContent>
  );
};

export default memo(ImportAccount);
