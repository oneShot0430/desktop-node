import React, { memo, useContext, useState, ChangeEventHandler } from 'react';
import { useMutation } from 'react-query';
import { useNavigate } from 'react-router-dom';

import RewardsSvg from 'assets/svgs/onboarding/rewards-icon.svg';
import SeedPhraseSvg from 'assets/svgs/onboarding/seed-phrase-icon.svg';
import { ErrorMessage } from 'webapp/components/ui/ErrorMessage';
import { useAccounts } from 'webapp/features/settings';
import {
  createNodeWallets,
  generateSeedPhrase,
  setActiveAccount,
} from 'webapp/services';
import { AppRoute } from 'webapp/types/routes';

import { OnboardingContext } from '../../context/onboarding-context';

const KeyCreationMethodPick = () => {
  const [accountName, setAccountName] = useState<string>('');
  const [isMissingAccountName, setIsMissingAccountName] =
    useState<boolean>(false);
  const navigate = useNavigate();
  const { setNewSeedPhrase, setSystemKey } = useContext(OnboardingContext);
  const { accounts } = useAccounts();

  const enteredNameIsInvalid = accounts?.some(
    (account) => account.accountName === accountName
  );

  const errorMessage = enteredNameIsInvalid
    ? 'You already have an account registered with that name'
    : isMissingAccountName
    ? 'Please enter an account name'
    : '';

  const createNewKey = async (accountName: string) => {
    const seedPhrase = await generateSeedPhrase();
    const resp = await createNodeWallets(seedPhrase, accountName);

    return {
      seedPhrase,
      mainAccountPubKey: resp.mainAccountPubKey,
      accountName,
    };
  };

  const seedPhraseGenerateMutation = useMutation(createNewKey, {
    onSuccess: async ({ seedPhrase, mainAccountPubKey, accountName }) => {
      await setActiveAccount(accountName);
      setNewSeedPhrase(seedPhrase);
      setSystemKey(mainAccountPubKey);
      navigate(AppRoute.OnboardingCreateNewKey);
    },
  });

  const handleChangeInput: ChangeEventHandler<HTMLInputElement> = (e) => {
    setIsMissingAccountName(false);
    setAccountName(e.target.value);
  };

  const handleClickCreate = () => {
    if (accountName) seedPhraseGenerateMutation.mutate(accountName);
    else setIsMissingAccountName(true);
  };

  const handleClickImport = () => {
    if (accountName)
      navigate(AppRoute.OnboardingImportKey, {
        state: { accountName },
      });
    else setIsMissingAccountName(true);
  };

  return (
    <div className="max-w-lg xl:max-w-2xl m-auto pt-[100px]">
      <div className="flex flex-col pl-1 text-lg">
        <p className="mb-4">
          To make sure everyone is playing fairly, each node must stake tokens
          as collateral.
        </p>
        <p>Create a new account or import an existing Koii key.</p>
      </div>

      <div className="my-6">
        <div className="px-5 mb-2 leading-8 text-left">Account name</div>
        <input
          className="w-full px-6 py-2 rounded-md bg-finnieBlue-light-tertiary"
          type="text"
          value={accountName}
          onChange={handleChangeInput}
          placeholder="Account name"
        />
        <div className="h-12 px-6 -mb-12">
          {errorMessage && <ErrorMessage errorMessage={errorMessage} />}
        </div>
      </div>

      <div className="mt-16 ">
        <div className="flex flex-row items-center justify-evenly">
          <div className="flex flex-col items-center">
            <button
              className="w-[180px] h-[180px] p-2 border-dashed border-finnieOrange rounded-full border-2 mb-4 cursor-pointer"
              onClick={handleClickCreate}
              disabled={enteredNameIsInvalid}
            >
              <div className="flex flex-col items-center justify-center w-full h-full rounded-full bg-finnieBlue-light-secondary">
                <RewardsSvg />
              </div>
            </button>
            Create a New Account
          </div>

          <div className="flex flex-col items-center">
            <button
              className="w-[180px] h-[180px] p-2 border-2 border-dashed border-finnieTeal rounded-full mb-4 cursor-pointer z-30"
              onClick={handleClickImport}
              disabled={enteredNameIsInvalid}
            >
              <div className="flex flex-col items-center justify-center w-full h-full rounded-full bg-finnieBlue-light-secondary">
                <SeedPhraseSvg />
              </div>
            </button>
            Import Account
          </div>
        </div>
      </div>
    </div>
  );
};

export default memo(KeyCreationMethodPick);
