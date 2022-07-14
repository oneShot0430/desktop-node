import React, { memo, useState } from 'react';

import UploadIcon from 'assets/svgs/upload-icon.svg';
import CloseIconWhite from 'svgs/close-icons/close-icon-white.svg';
import { Button } from 'webapp/components/ui/Button';

import { ModalContent } from '../../Modal';
import { Steps } from '../AddKeyModal';

type PropsType = Readonly<{
  onClose: () => void;
  setNextStep: (step: Steps) => void;
}>;

const ImportWithKeyPhrase = ({ onClose }: PropsType) => {
  const [keyPhrase, setKeyPhrase] = useState('');

  const handleTextareaChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setKeyPhrase(e.target.value);
  };

  const handleImportFromPhrase = () => {
    // TODO: implement
    console.log('importing from phrase', keyPhrase);
  };

  return (
    <ModalContent theme="dark" className="w-[800px] h-[400px]">
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
        <div className="px-[42px]">
          <div className="pb-3 pl-3 text-left">Secret Phrase</div>
          <textarea
            value={keyPhrase}
            onChange={handleTextareaChange}
            className="rounded-md resize-none w-[100%] h-[180px] text-finnieTeal p-4 bg-finnieBlue-light-tertiary text-2xl"
            placeholder="Start typing or copy/paste into the box."
          />
        </div>
        <div className="flex justify-center mt-8">
          <Button
            onClick={handleImportFromPhrase}
            label="Import Key"
            className="font-semibold bg-finnieGray-tertiary text-finnieBlue-light w-[220px] h-[48px]"
          />
        </div>
      </div>
    </ModalContent>
  );
};

export default memo(ImportWithKeyPhrase);
