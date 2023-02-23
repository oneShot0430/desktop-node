import React, { memo } from 'react';

import { ReactComponent as CloseIconWhite } from 'assets/svgs/close-icons/close-icon-white.svg';
import { Button } from 'renderer/components/ui';
import { ModalContent } from 'renderer/features/modals';
import { Theme } from 'renderer/types/common';

import { Steps } from '../types';

type PropsType = {
  onClose: () => void;
  setNextStep: (step: Steps) => void;
  seedPhrase: string;
};

function ShowSeedPhrase({ onClose, setNextStep, seedPhrase }: PropsType) {
  const phraseWords = seedPhrase.split(' ');

  return (
    <ModalContent theme={Theme.Dark} className="w-[800px] h-[400px] text-white">
      <div className="flex justify-between p-3">
        <div />
        <div className="flex items-center justify-between pl-6">
          <span className="text-[24px]">Seed Phrase</span>
        </div>
        <CloseIconWhite className="w-[32px] h-[32px]" onClick={onClose} />
      </div>
      <div className="flex justify-center">
        <div className="selection-text columns-2 bg-finnieBlue-light-tertiary w-[360px] rounded py-4 px-[30px] select-text">
          {phraseWords.map((word, index) => {
            const wordNumber = index + 1;
            return (
              <div
                className="gap-3 mb-2 text-sm text-left select-text"
                key={word}
              >{`${wordNumber}. ${word}`}</div>
            );
          })}
        </div>
      </div>

      <div className="flex justify-center mt-8">
        <Button
          onClick={() => setNextStep(Steps.KeyCreated)}
          label="Show Keys"
          className="font-semibold bg-finnieGray-tertiary text-finnieBlue-light w-[220px] h-[48px]"
        />
      </div>
    </ModalContent>
  );
}

export default memo(ShowSeedPhrase);
