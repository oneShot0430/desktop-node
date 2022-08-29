import React, { memo } from 'react';

import UploadIcon from 'assets/svgs/upload-icon.svg';
import CloseIconWhite from 'svgs/close-icons/close-icon-white.svg';
import { ImportFromSeedPhrase } from 'webapp/components/ImportFromSeedPhrase';

import { ModalContent } from '../../Modal';
import { Steps } from '../AddKeyModal';

type PropsType = Readonly<{
  onClose: () => void;
  setNextStep: (step: Steps) => void;
}>;

const ImportWithKeyPhrase = ({ onClose }: PropsType) => {
  const handleImportSuccess = (key: string) => {
    /**
     * @todo: import account
     */
    console.log('###import success', key);
  };

  return (
    <ModalContent theme="dark" className="w-[800px] h-[460px]">
      <div className="text-white">
        <div className="flex justify-between p-3">
          <div className="flex items-center justify-between pl-6">
            <UploadIcon />
            <span className="text-[24px]">
              Import a key with a secret phrase
            </span>
          </div>

          <CloseIconWhite className="w-[32px] h-[32px]" onClick={onClose} />
        </div>

        <ImportFromSeedPhrase
          /**
           * @todo: add account name from input field
           */
          accountName="Test account"
          onImportSuccess={handleImportSuccess}
          confirmActionLabel={'Import Account'}
        />
      </div>
    </ModalContent>
  );
};

export default memo(ImportWithKeyPhrase);
