import React, { memo, useState } from 'react';

import KeyIconSvg from 'assets/svgs/key-icon-white.svg';
import CloseIconWhite from 'svgs/close-icons/close-icon-white.svg';
import PinInput from 'webapp/components/PinInput/PinInput';
import { Button } from 'webapp/components/ui/Button';
import { ErrorMessage } from 'webapp/components/ui/ErrorMessage';
import { createNodeWallets, generateSeedPhrase } from 'webapp/services';

import { ModalContent } from '../../Modal';
import { CreateKeyPayload, Steps } from '../AddKeyModal';

type PropsType = Readonly<{
  onClose: () => void;
  setNextStep: (step: Steps, payload: CreateKeyPayload) => void;
}>;

// TODO:
function validatePin(pin: string) {
  return true;
}

const CreateNewKey = ({ onClose, setNextStep }: PropsType) => {
  const [pin, setPin] = useState('');
  const [error, setError] = useState<string>(null);
  const [accountName, setAccounttName] = useState('');

  const handleCreateNewKey = async () => {
    try {
      if (validatePin(pin)) {
        const seedPhrase = await generateSeedPhrase();

        const { stakingWalletPubKey, mainAccountPubKey } =
          await createNodeWallets(seedPhrase, accountName);

        setNextStep(Steps.ShowSeedPhrase, {
          keyes: {
            task: stakingWalletPubKey,
            system: mainAccountPubKey,
          },
          seedPhrase,
        });
      } else {
        setError('Your pin is not correct');
      }
    } catch (error) {
      setError(error.message);
    }
  };

  const handlePinInputChange = (pin: string) => {
    setPin(pin);
  };

  const handleWalletNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setAccounttName(e.target.value);
  };

  return (
    <ModalContent theme="dark" className="w-[800px] h-[520px] text-white">
      <div className="flex justify-between p-3">
        <div className="flex items-center justify-between pl-6">
          <KeyIconSvg />
          <span className="text-[24px]">Create a New Account</span>
        </div>

        <CloseIconWhite className="w-[32px] h-[32px]" onClick={onClose} />
      </div>
      <div>
        <div className="px-[62px] text-left leading-8 mb-4">
          With a new account you’ll get a new set of keys that work together to
          hold your funds, rewards, and running tasks, all with one secret
          phrase.
        </div>

        <div className="px-12 my-8">
          <div className="px-[20px] text-left leading-8 mb-4">Account name</div>
          <input
            className="w-full px-6 py-2 rounded-md bg-finnieBlue-light-tertiary "
            type="text"
            value={accountName}
            onChange={handleWalletNameChange}
            placeholder="Account name"
          />
        </div>

        <div className="px-12">
          <div className="pl-4 mb-4 text-left">
            Re-enter your PIN code so we can securely create the new key:
          </div>
          <div className="bg-finnieBlue-light-tertiary p-[26px] flex flex-col items-start rounded-md">
            <PinInput onChange={handlePinInputChange} />
          </div>
        </div>

        {error && <ErrorMessage errorMessage={error} />}

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
