import React, { memo, useState } from 'react';

import CreateNewKey from './components/CreateNewKey';
import ImportKey from './components/ImportKey';
import ImportWithKeyPhrase from './components/ImportWithKeyPhrase';
import KeyCreated from './components/KeyCreated';

export enum Steps {
  ImportKey,
  ImportWithKeyPhrase,
  CreateNewKey,
  KeyCreated,
}

const AddKeyModal = ({ onClose }: { onClose: () => void }) => {
  const [currentStep, setCurrentStep] = useState(Steps.ImportKey);

  const getCurrentView = (step: Steps) => {
    const views = {
      [Steps.ImportKey]: (
        <ImportKey onClose={onClose} setNextStep={setCurrentStep} />
      ),
      [Steps.ImportWithKeyPhrase]: (
        <ImportWithKeyPhrase onClose={onClose} setNextStep={setCurrentStep} />
      ),
      [Steps.CreateNewKey]: (
        <CreateNewKey onClose={onClose} setNextStep={setCurrentStep} />
      ),
      [Steps.KeyCreated]: (
        <KeyCreated onClose={onClose} setNextStep={setCurrentStep} />
      ),
    };

    return views[step];
  };

  return getCurrentView(currentStep);
};

export default memo(AddKeyModal);
