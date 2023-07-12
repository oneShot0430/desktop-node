import { decrypt } from '@metamask/browser-passworder';
import React, { useCallback, useState } from 'react';
import { useQueryClient } from 'react-query';

import { PinInput } from 'renderer/components/PinInput';
import { ErrorMessage, Button } from 'renderer/components/ui';
import { useKeyInput } from 'renderer/features/common/hooks';
import { useUserSettings } from 'renderer/features/common/hooks/userSettings';
import { QueryKeys, getEncryptedSecretPhrase } from 'renderer/services';
import { validatePin } from 'renderer/utils';

import { Steps } from '../types';

type PropsType = Readonly<{
  setNextStep: (step: Steps) => void;
  accountName: string;
  publicKey: string;
  setSeedPhrase: (seedPhrase: string) => void;
}>;

export function EnterNodePassword({
  setNextStep,
  accountName,
  publicKey,
  setSeedPhrase,
}: PropsType) {
  const [pin, setPin] = useState('');
  const [error, setError] = useState<Error | string>('');
  const queryCache = useQueryClient();
  const { settings } = useUserSettings();

  const handleCreateNewKey = async () => {
    const isPinValid = await validatePin(pin, settings?.pin);

    try {
      if (isPinValid) {
        const encryptedSecretPhrase = await getEncryptedSecretPhrase(publicKey);
        if (!encryptedSecretPhrase) {
          return setError(
            "It looks like this key wasn't generated with a secret phrase"
          );
        }
        const seedPhrase: string = (await decrypt(
          pin,
          encryptedSecretPhrase
        )) as string;
        setSeedPhrase(seedPhrase);
        setNextStep(Steps.ShowSecretPhase);
      } else {
        setError(
          "Whoops. That PIN isn't right. Double check it and try again."
        );
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

  useKeyInput(
    'Enter',
    handleCreateNewKey,
    accountName.length === 0 || pin.length !== 6
  );

  return (
    <div className="text-white">
      <div className="flex text-lg px-12 leading-6 font-semibold pt-6 text-white">
        Account Name:{' '}
        <span className="ml-1 tracking-tight font-normal">{accountName}</span>
      </div>

      <p className="px-12 mt-1.5 tracking-tight w-full items-start text-start leading-[32px] text-base">
        If you change or switch computers, you will need this Recovery Phrase to
        access your account.{' '}
        <span className="font-bold">
          Never share this phrase and keep it somewhere safe.
        </span>
      </p>

      <div className="px-10 mt-5">
        <p className="pl-2 mb-1.5 text-left uppercase tracking-widest">
          Enter node Access PIN
        </p>
        <div className="bg-transparent w-full px-2.5 pt-5 pb-4 flex flex-col items-start rounded-md">
          <PinInput onChange={handlePinInputChange} />
        </div>
      </div>

      {error && (
        <div className="flex flex-col items-center px-4">
          <ErrorMessage error={error} />
        </div>
      )}

      <div className="flex justify-center pt-2">
        <Button
          disabled={accountName.length === 0 || pin.length !== 6}
          onClick={handleCreateNewKey}
          label="Reveal Secret Phrase"
          className="font-semibold bg-white text-finnieBlue-light w-[220px] h-[48px]"
        />
      </div>
    </div>
  );
}
