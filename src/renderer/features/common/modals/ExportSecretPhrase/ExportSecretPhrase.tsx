import { Icon, KeyUnlockLine, CloseLine } from '@_koii/koii-styleguide';
import { create, useModal } from '@ebay/nice-modal-react';
import React, { useState } from 'react';

import { Modal, ModalContent } from 'renderer/features/modals';
import { Theme } from 'renderer/types/common';

import { EnterNodePassword } from './components/EnterNodePassword';
import ShowSecretPhrase from './components/ShowSecretPhrase';
import { Steps } from './types';

type PropsType = {
  accountName: string;
  publicKey: string;
};

export const ExportSecretPhrase = create<PropsType>(
  function ExportSecretePhrase({ accountName, publicKey }) {
    const modal = useModal();
    const [currentStep, setCurrentStep] = useState(Steps.EnterNodePassword);
    const [seedPhrase, setSeedPhrase] = useState('');

    const handleClose = () => {
      modal.remove();
    };

    const getCurrentView = (step: Steps) => {
      const views = {
        [Steps.EnterNodePassword]: (
          <EnterNodePassword
            setNextStep={setCurrentStep}
            accountName={accountName}
            publicKey={publicKey}
            setSeedPhrase={setSeedPhrase}
          />
        ),
        [Steps.ShowSecretPhase]: (
          <ShowSecretPhrase onClose={handleClose} seedPhrase={seedPhrase} />
        ),
      };

      return (
        <Modal>
          <ModalContent
            theme={Theme.Dark}
            className="w-[791px] text-white pt-4 pb-6"
          >
            <div className="flex justify-between p-3">
              <div className="flex items-center justify-between pl-9">
                <Icon
                  source={KeyUnlockLine}
                  className="h-8 w-6 mr-5 text-white"
                />
                <span className="text-2xl">Reveal Secret Phrase</span>
              </div>
              <Icon
                source={CloseLine}
                className="w-8 h-8 cursor-pointer"
                onClick={handleClose}
              />
            </div>
            {views[step]}
          </ModalContent>
        </Modal>
      );
    };
    return getCurrentView(currentStep);
  }
);
