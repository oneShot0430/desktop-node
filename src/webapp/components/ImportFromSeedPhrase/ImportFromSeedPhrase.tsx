import React, { useState } from 'react';

import { createNodeWallets, setActiveAccount } from 'webapp/services';

import { Button } from '../ui/Button';
import { ErrorMessage } from '../ui/ErrorMessage';

export interface AccountsType {
  stakingAccountPubKey: string;
  mainAccountPubKey: string;
}

type PropsType = {
  confirmActionLabel: string;
  onImportSuccess: (accounts: any) => void;
  onImportFail?: (error: string) => void;
  setImportedWalletAsDefault?: boolean;
};

const ImportFromSeedPhrase = ({
  onImportSuccess,
  onImportFail,
  confirmActionLabel,
  setImportedWalletAsDefault = false,
}: PropsType) => {
  const [phrases, setPhrases] = useState(new Array(12).fill(''));
  const [error, setError] = useState<string>();

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    phraseIndex: number
  ) => {
    const value = e.target.value;
    const newPhrases = Object.assign([], phrases, {
      [phraseIndex]: value,
    });
    console.log('###newPrases', newPhrases);
    setPhrases(newPhrases);
  };

  const validateKeyPhrase = (phrases: string[]) => {
    const isNotEmpty = (item: string) => item !== '';
    const allPhrasesAreProvided = phrases.every(isNotEmpty);
    return allPhrasesAreProvided;
  };

  const handleImportFromPhrase = async () => {
    const keyPhraseString = phrases.join(' ');
    console.log('### importing from phrase', keyPhraseString);

    const allPhrasesAreProvided = validateKeyPhrase(phrases);

    if (allPhrasesAreProvided) {
      setError(null);
      try {
        const accountName = 'Main Account Onboarding' + Math.random();
        const accounts = await createNodeWallets(
          keyPhraseString,
          /**
           * @todo: just for testing, name should be provided by user
           */
          accountName
        );

        if (setImportedWalletAsDefault) {
          console.log('###setting active account', accountName);
          await setActiveAccount(accountName);
        }

        onImportSuccess({
          mainAccountPubKey: accounts.mainAccountPubKey,
          stakingAccountPubKey: accounts.stakingWalletPubKey,
        });
      } catch (error) {
        console.log('### Error', error);
        setError(error.message);
        if (onImportFail) {
          onImportFail(error);
        }
      }
    } else {
      setError('Seed phrase is not complete.');
    }
  };

  return (
    <div className="relative">
      <div className="px-[42px]">
        <div className="flex justify-center">
          <div className="columns-2 bg-finnieBlue-light-secondary w-[360px] rounded py-4 px-[30px] select-text">
            {phrases.map((_, index) => {
              const wordNumber = index + 1;
              return (
                <div
                  className="flex flex-row items-center justify-between mb-2"
                  key={index}
                >
                  <div>{wordNumber}</div>
                  <input
                    className="w-[120px] bg-transparent focus:border-b focus:border-white focus:outline-none text-sm"
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
        <div className="mb-2">
          {error && <ErrorMessage errorMessage={error} />}
        </div>
        <Button
          onClick={handleImportFromPhrase}
          label={confirmActionLabel}
          className="font-semibold bg-finnieGray-light text-finnieBlue-light w-[240px] h-[48px]"
        />
      </div>
    </div>
  );
};

export default ImportFromSeedPhrase;
