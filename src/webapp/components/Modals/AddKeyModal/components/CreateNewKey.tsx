import React, { memo, useState } from 'react';

import KeyIconSvg from 'assets/svgs/key-icon-white.svg';
import CloseIconWhite from 'svgs/close-icons/close-icon-white.svg';
import PinInput from 'webapp/components/PinInput/PinInput';
import { Button } from 'webapp/components/ui/Button';

import { ModalContent } from '../../Modal';
import { Steps } from '../AddKeyModal';

type PropsType = Readonly<{
  onClose: () => void;
  setNextStep: (step: Steps) => void;
}>;

// TODO:
function validatePin(pin: string) {
  return true;
}

const CreateNewKey = ({ onClose, setNextStep }: PropsType) => {
  const [pin, setPin] = useState('');
  const [error, setError] = useState<string>(null);

  const handleCreateNewKey = () => {
    if (validatePin(pin)) {
      // TODO: implement key creation

      setNextStep(Steps.KeyCreated);
    } else {
      setError('Your pin is not correct');
    }
  };

  const handlePinInputChange = (pin: string) => {
    setPin(pin);
  };

  return (
    <ModalContent theme="dark" className="w-[800px] h-[400px] text-white">
      <div className="flex justify-between p-3">
        <div className="flex items-center justify-between pl-6">
          <KeyIconSvg />
          <span className="text-[24px]">Create a new key</span>
        </div>

        <CloseIconWhite className="w-[32px] h-[32px]" onClick={onClose} />
      </div>
      <div>
        <div className="px-[62px] text-left leading-8 mb-4">
          We will create both your{' '}
          <span className="underline text-finnieTeal">System</span> and{' '}
          <span className="underline text-finnieTeal">Task</span> key to which
          you’ll have access through one seed phrase.
        </div>

        <div className="px-12">
          <div className="pl-4 mb-4 text-left">
            Re-enter your PIN code so we can securely create the new key:
          </div>
          <div className="bg-finnieBlue-light-tertiary p-[26px] flex flex-col items-start rounded-md">
            <PinInput onChange={handlePinInputChange} />
          </div>
        </div>

        <div className="flex justify-center mt-8">
          <Button
            onClick={handleCreateNewKey}
            label="Create Key"
            className="font-semibold bg-finnieGray-tertiary text-finnieBlue-light w-[220px] h-[48px]"
          />
        </div>
      </div>
    </ModalContent>
  );
};

export default memo(CreateNewKey);
