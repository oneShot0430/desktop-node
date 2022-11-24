import { create, useModal } from '@ebay/nice-modal-react';
import React, { useState } from 'react';

import { Modal } from 'webapp/features/modals';

import { AccountCreated } from './components/AccountCreated';
import { AccountSuccessfullyImported } from './components/AccountSuccessfullyImported';
import { CreateNewAccount } from './components/CreateNewAccount';
import ImportKey from './components/ImportAccount';
import ImportWithKeyPhrase from './components/ImportWithKeyPhrase';
import ShowSeedPhrase from './components/ShowSeedPhrase';

export type KeysType = { system: string; task: string };

export type CreateKeyPayload = { keys: KeysType; seedPhrase: string };

export enum Steps {
  ImportKey,
  ImportWithKeyPhrase,
  CreateNewKey,
  KeyCreated,
  ShowSeedPhrase,
  AccountImported,
}

export const AddNewAccount = create(function AddNewAccount() {
  const modal = useModal();
  const [currentStep, setCurrentStep] = useState(Steps.ImportKey);
  const [newKeys, setNewKeys] = useState<KeysType>(null);
  const [seedPhrase, setSeedPhrase] = useState('');

  const handleCreatedNewKeyStep = (step: Steps, payload: CreateKeyPayload) => {
    setNewKeys(payload.keys);
    setSeedPhrase(payload.seedPhrase);
    setCurrentStep(step);
  };

  const handleClose = () => {
    modal.remove();
  };

  const getCurrentView = (step: Steps) => {
    const views = {
      [Steps.ImportKey]: (
        <ImportKey onClose={handleClose} setNextStep={setCurrentStep} />
      ),
      [Steps.ImportWithKeyPhrase]: (
        <ImportWithKeyPhrase
          onClose={handleClose}
          onImportSuccess={({ stakingAccountPubKey, mainAccountPubKey }) => {
            setNewKeys({
              task: stakingAccountPubKey,
              system: mainAccountPubKey,
            });
            setCurrentStep(Steps.AccountImported);
          }}
        />
      ),
      [Steps.CreateNewKey]: (
        <CreateNewAccount
          onClose={handleClose}
          setNextStep={handleCreatedNewKeyStep}
        />
      ),
      [Steps.KeyCreated]: (
        <AccountCreated
          onClose={handleClose}
          setNextStep={setCurrentStep}
          newKeys={newKeys}
        />
      ),
      [Steps.AccountImported]: (
        <AccountSuccessfullyImported
          onClose={handleClose}
          setNextStep={setCurrentStep}
          newKeys={newKeys}
        />
      ),
      [Steps.ShowSeedPhrase]: (
        <ShowSeedPhrase
          onClose={handleClose}
          setNextStep={setCurrentStep}
          seedPhrase={seedPhrase}
        />
      ),
    };

    return <Modal>{views[step]}</Modal>;
  };

  return getCurrentView(currentStep);
});
