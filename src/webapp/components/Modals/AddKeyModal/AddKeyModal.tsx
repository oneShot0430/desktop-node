import React, { memo, useState } from 'react';

import CreateNewKey from './components/CreateNewKey';
import ImportKey from './components/ImportKey';
import ImportWithKeyPhrase from './components/ImportWithKeyPhrase';
import KeyCreated from './components/KeyCreated';
import ShowSeedPhrase from './components/ShowSeedPhrase';

export type KeysType = { system: string; task: string };

export type CreateKeyPayload = { keyes: KeysType; seedPhrase: string };

export enum Steps {
  ImportKey,
  ImportWithKeyPhrase,
  CreateNewKey,
  KeyCreated,
  ShowSeedPhrase,
}

const AddKeyModal = ({ onClose }: { onClose: () => void }) => {
  const [currentStep, setCurrentStep] = useState(Steps.ImportKey);
  const [newKeys, setNewKeys] = useState<KeysType>(null);
  const [seedPhrase, setSeedPhrase] = useState(null);

  const handleCreatedNewKeyStep = (step: Steps, payload: CreateKeyPayload) => {
    setNewKeys(payload.keyes);
    setSeedPhrase(payload.seedPhrase);
    setCurrentStep(step);
  };

  const getCurrentView = (step: Steps) => {
    const views = {
      [Steps.ImportKey]: (
        <ImportKey onClose={onClose} setNextStep={setCurrentStep} />
      ),
      [Steps.ImportWithKeyPhrase]: (
        <ImportWithKeyPhrase onClose={onClose} setNextStep={setCurrentStep} />
      ),
      [Steps.CreateNewKey]: (
        <CreateNewKey onClose={onClose} setNextStep={handleCreatedNewKeyStep} />
      ),
      [Steps.KeyCreated]: (
        <KeyCreated
          onClose={onClose}
          setNextStep={setCurrentStep}
          newKeys={newKeys}
        />
      ),
      [Steps.ShowSeedPhrase]: (
        <ShowSeedPhrase
          onClose={onClose}
          setNextStep={setCurrentStep}
          seedPhrase={seedPhrase}
        />
      ),
    };

    return views[step];
  };

  return getCurrentView(currentStep);
};

export default memo(AddKeyModal);
