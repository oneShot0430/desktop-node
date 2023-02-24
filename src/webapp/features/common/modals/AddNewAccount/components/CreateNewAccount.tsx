import { Icon, KeyUnlockLine, CloseLine } from '@_koii/koii-styleguide';
import { compare } from 'bcryptjs';
import React, { useCallback, useState } from 'react';
import { useQueryClient } from 'react-query';

import { PinInput } from 'webapp/components/PinInput';
import { ErrorMessage, Button } from 'webapp/components/ui';
import { useUserSettings } from 'webapp/features/common/hooks';
import { ModalContent } from 'webapp/features/modals';
import {
  createNodeWallets,
  generateSeedPhrase,
  QueryKeys,
} from 'webapp/services';
import { Theme } from 'webapp/types/common';

import { CreateKeyPayload, Steps } from '../types';

type PropsType = Readonly<{
  onClose: () => void;
  setNextStep: (step: Steps, payload: CreateKeyPayload) => void;
}>;

export function CreateNewAccount({ onClose, setNextStep }: PropsType) {
  const [pin, setPin] = useState('');
  const [error, setError] = useState<Error | string>('');
  const [accountName, setAccounttName] = useState('');
  const queryCache = useQueryClient();
  const { settings } = useUserSettings();

  const validatePin = async (pin: string) => {
    if (pin.length === 6) {
      const pinMatchesStoredHash = await compare(pin, settings?.pin || '');
      return pinMatchesStoredHash;
    }
    return false;
  };

  const handleCreateNewKey = async () => {
    const isPinValid = await validatePin(pin);

    try {
      if (isPinValid) {
        const seedPhrase = await generateSeedPhrase();

        const { stakingWalletPubKey, mainAccountPubKey } =
          await createNodeWallets(seedPhrase, accountName);

        setNextStep(Steps.ShowSeedPhrase, {
          keys: {
            task: stakingWalletPubKey,
            system: mainAccountPubKey,
          },
          seedPhrase,
        });
      } else {
        setError('Your pin is not correct');
      }
    } catch (error: any) {
      setError(error);
    } finally {
      queryCache.invalidateQueries(QueryKeys.Accounts);
    }
  };

  const handlePinInputChange = useCallback((pin: string) => {
    setPin(pin);
  }, []);

  const handleWalletNameChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setAccounttName(e.target.value);
    },
    []
  );

  return (
    <ModalContent theme={Theme.Dark} className="w-[800px] h-[520px] text-white">
      <div className="flex justify-between p-3">
        <div className="flex items-center justify-between pl-6">
          <Icon source={KeyUnlockLine} className="h-8 w-6 mx-5" />
          <span className="text-[24px]">Create a New Account</span>
        </div>
        <Icon
          source={CloseLine}
          className="w-8 h-8 cursor-pointer"
          onClick={onClose}
        />
        {/*  not sure */}
      </div>
      <div>
        <div className="px-[62px] text-left leading-8 mb-4">
          With a new account you’ll get a new set of keys that work together to
          hold your funds, rewards, and running tasks, all with one secret
          phrase.
        </div>

        <div className="px-12 my-8">
          <div className="px-[20px] text-left leading-8 mb-4">
            Account name<span className="text-finnieRed-500">*</span>
          </div>
          <input
            className="w-full px-6 py-2 text-sm rounded-md bg-finnieBlue-light-tertiary focus:ring-2 focus:ring-finnieTeal focus:outline-none focus:bg-finnieBlue-light-secondary "
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

        <div className="flex flex-col items-center h-10 px-4">
          <ErrorMessage error={error} />
        </div>

        <div className="flex justify-center">
          <Button
            disabled={accountName.length === 0 || pin.length !== 6}
            onClick={handleCreateNewKey}
            label="Create Key"
            className="font-semibold bg-finnieGray-tertiary text-finnieBlue-light w-[220px] h-[48px]"
          />
        </div>
      </div>
    </ModalContent>
  );
}
