import { encrypt } from '@metamask/browser-passworder';
import React, { useState, ChangeEvent } from 'react';
import { twMerge } from 'tailwind-merge';

import { ErrorMessage, Button } from 'renderer/components/ui';
import { createNodeWallets, setActiveAccount } from 'renderer/services';

export interface AccountsType {
  accountName: string;
  mainAccountPubKey: string;
}

type PropsType = {
  accountName: string;
  confirmActionLabel: string;
  onImportSuccess: (accounts: AccountsType) => void;
  onImportFail?: (error: string) => void;
  setImportedWalletAsDefault?: boolean;
  className?: string;
  accountEncryptedPin: string;
};

function ImportFromSeedPhrase({
  accountName,
  onImportSuccess,
  onImportFail,
  confirmActionLabel,
  setImportedWalletAsDefault = false,
  className,
  accountEncryptedPin,
}: PropsType) {
  const [phrases, setPhrases] = useState(new Array(12).fill(''));
  const [error, setError] = useState<Error | string>('');
  const [loading, setLoading] = useState(false);

  const handleInputChange = (
    e: ChangeEvent<HTMLInputElement>,
    phraseIndex: number
  ) => {
    setError('');
    const { value } = e.target;
    const newPhrases = Object.assign([], phrases, {
      [phraseIndex]: value,
    });
    setPhrases(newPhrases);
  };

  const validateKeyPhrase = (phrases: string[]) => {
    const isNotEmpty = (item: string) => item !== '';
    const allPhrasesAreProvided = phrases.every(isNotEmpty);
    return allPhrasesAreProvided;
  };

  const handleImportFromPhrase = async () => {
    const keyPhraseString = phrases.join(' ');
    const allPhrasesAreProvided = validateKeyPhrase(phrases);

    if (allPhrasesAreProvided) {
      setError('');
      try {
        setLoading(true);

        const encryptedSecretPhrase: string = await encrypt(
          accountEncryptedPin,
          keyPhraseString
        );
        const accounts = await createNodeWallets(
          keyPhraseString,
          accountName,
          encryptedSecretPhrase
        );

        if (setImportedWalletAsDefault) {
          await setActiveAccount(accountName);
        }
        setLoading(false);
        onImportSuccess({
          mainAccountPubKey: accounts.mainAccountPubKey,
          accountName,
        });
      } catch (error: any) {
        setError(error);
        setLoading(false);
        if (onImportFail) {
          onImportFail(error);
        }
      }
    } else {
      setError('Seed phrase is not complete.');
    }
  };

  const classes = twMerge(
    'columns-2 bg-finnieBlue-light-secondary w-[360px] rounded py-4 px-[30px] select-text',
    className ?? ''
  );

  return (
    <div className="relative">
      <div>
        <div className="flex justify-center">
          <div className={classes}>
            {phrases.map((_, index) => {
              const wordNumber = index + 1;
              return (
                <div
                  className="flex flex-row items-center justify-between mb-2"
                  key={index}
                >
                  <div>{wordNumber}.</div>
                  <input
                    className="w-[120px] p-1 rounded-md bg-transparent focus:ring-1 focus:ring-finnieTeal focus:outline-none text-sm focus:bg-finnieBlue-light-secondary"
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
        <div className="mb-2">{error && <ErrorMessage error={error} />}</div>
        <Button
          onClick={handleImportFromPhrase}
          label={confirmActionLabel}
          className="font-semibold bg-white text-finnieBlue-light w-[240px] h-[48px]"
          loading={loading}
        />
      </div>
    </div>
  );
}

export default ImportFromSeedPhrase;
