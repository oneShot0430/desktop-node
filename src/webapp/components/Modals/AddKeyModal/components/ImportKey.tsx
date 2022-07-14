import React, { memo, useEffect, useRef } from 'react';

import AddIcon from 'assets/svgs/add-icon-outlined.svg';
import UploadIcon from 'assets/svgs/upload-icon.svg';

import { ModalContent } from '../../Modal';
import ModalTopBar from '../../Modal/ModalTopBar';
import { Steps } from '../AddKeyModal';

import AddKeyAction from './AddKeyAction';

type PropsType = Readonly<{
  onClose: () => void;
  setNextStep: (step: Steps) => void;
}>;

const ImportWithKeyPhrase = ({ onClose, setNextStep }: PropsType) => {
  const ref = useRef(null);

  useEffect(() => {
    if (ref.current) {
      ref.current.focus();
    }
  });

  return (
    <ModalContent theme="dark" className="w-[800px] h-[320px]">
      <ModalTopBar theme="dark" title={'Key Management'} onClose={onClose} />
      <div className="flex flex-col items-start gap-2 pl-12">
        <div className="text-xl font-semibold text-white">Add New Account</div>
        <AddKeyAction
          onClick={() => setNextStep(Steps.ImportWithKeyPhrase)}
          ref={ref}
          title="Import with a seed phrase"
          description="Import an existing wallet using a 12-word seed phrase"
          icon={<UploadIcon />}
        />

        <AddKeyAction
          onClick={() => setNextStep(Steps.CreateNewKey)}
          title="Get a new key"
          description="Start from the beginning"
          icon={<AddIcon />}
        />
      </div>
    </ModalContent>
  );
};

export default memo(ImportWithKeyPhrase);
