import React, { memo, useState } from 'react';

import UploadIcon from 'assets/svgs/upload-icon.svg';
import CloseIconWhite from 'svgs/close-icons/close-icon-white.svg';
import { Button } from 'webapp/components/ui/Button';
import { ErrorMessage } from 'webapp/components/ui/ErrorMessage';

import { ModalContent } from '../../Modal';
import { Steps } from '../AddKeyModal';

type PropsType = Readonly<{
  onClose: () => void;
  setNextStep: (step: Steps) => void;
}>;

const ImportWithKeyPhrase = ({ onClose }: PropsType) => {
  const [phrases, setPhrases] = useState(new Array(12).fill(''));
  const [error, setError] = useState<string>();

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    phraseIndex: number
  ) => {
    const value = e.target.value;
    const newPhrases = Object.assign([], phrases, {
      [phraseIndex]: value,
    });
    console.log('###newPrases', newPhrases);
    setPhrases(newPhrases);
  };

  const validateKeyPhrase = (phrases: string[]) => {
    const isNotEmpty = (item: string) => item !== '';
    const allPhrasesAreProvided = phrases.every(isNotEmpty);
    return allPhrasesAreProvided;
  };

  const handleImportFromPhrase = () => {
    const keyPhraseString = phrases.join(' ');
    console.log('importing from phrase', keyPhraseString);

    const allPhrasesAreProvided = validateKeyPhrase(phrases);

    if (allPhrasesAreProvided) {
      console.log('####import');
    } else {
      setError('Seed phrase is not complete.');
    }
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
        <div className="px-[42px]">
          <div className="flex justify-center">
            <div className="columns-2 bg-finnieBlue-light-tertiary w-[360px] rounded py-4 px-[30px] select-text">
              {phrases.map((phrase, index) => {
                const wordNumber = index + 1;
                return (
                  <div
                    className="flex flex-row items-center justify-between mb-3"
                    key={index}
                  >
                    <div>{wordNumber}</div>
                    <input
                      className="w-[120px] bg-finnieBlue-light-tertiary border-b border-white"
                      onChange={(e) => handleInputChange(e, index)}
                      value={phrases[index]}
                    />
                  </div>
                );
              })}
            </div>
          </div>
        </div>
        <div className="flex flex-col items-center justify-center mt-6">
          <div className="mb-2">
            {error && <ErrorMessage errorMessage={error} />}
          </div>
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
