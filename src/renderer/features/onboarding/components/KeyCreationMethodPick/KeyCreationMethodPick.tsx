import {
  SeedSecretPhraseXlLine,
  Icon,
  TooltipChatQuestionLeftLine,
} from '@_koii/koii-styleguide';
import { encrypt } from '@metamask/browser-passworder';
import React, { memo, useState, ChangeEventHandler } from 'react';
import { useMutation, useQueryClient } from 'react-query';
import { useNavigate } from 'react-router-dom';

import CreateAccountSvg from 'assets/svgs/onboarding/create-new-account-icon.svg';
import { Tooltip } from 'renderer/components/ui';
import { ErrorMessage } from 'renderer/components/ui/ErrorMessage';
import { useAccounts } from 'renderer/features/settings';
import {
  QueryKeys,
  createNodeWallets,
  generateSeedPhrase,
  setActiveAccount,
} from 'renderer/services';
import { AppRoute } from 'renderer/types/routes';

import { useOnboardingContext } from '../../context/onboarding-context';

function KeyCreationMethodPick() {
  const [accountName, setAccountName] = useState<string>('');
  const [error, setError] = useState<Error | string>('');
  const navigate = useNavigate();
  const { setNewSeedPhrase, setSystemKey, newAccountPin } =
    useOnboardingContext();
  const { accounts } = useAccounts();

  const createNewKey = async (accountName: string) => {
    const seedPhrase = await generateSeedPhrase();
    const encryptedSecretPhrase: string = await encrypt(
      newAccountPin,
      seedPhrase
    );

    const resp = await createNodeWallets(
      seedPhrase,
      accountName,
      encryptedSecretPhrase
    );
    return {
      seedPhrase,
      mainAccountPubKey: resp.mainAccountPubKey,
      accountName,
    };
  };

  const queryCache = useQueryClient();

  const seedPhraseGenerateMutation = useMutation(createNewKey, {
    onSuccess: async ({ seedPhrase, mainAccountPubKey, accountName }) => {
      await setActiveAccount(accountName);
      setNewSeedPhrase(seedPhrase);
      setSystemKey(mainAccountPubKey);
      queryCache.invalidateQueries(QueryKeys.MainAccount);
      navigate(AppRoute.OnboardingCreateNewKey);
    },
    onError: (error) => {
      setError(error as Error);
    },
  });

  const handleChangeInput: ChangeEventHandler<HTMLInputElement> = ({
    target: { value: enteredAccountName },
  }) => {
    setError('');
    setAccountName(enteredAccountName);
    const enteredNameIsDuplicate = accounts?.some(
      (account) => account.accountName === enteredAccountName
    );
    if (enteredNameIsDuplicate) {
      setError('You already have an account registered with that name');
    }
  };

  const handleClickCreate = () => {
    seedPhraseGenerateMutation.mutate(accountName);
  };

  const handleClickImport = () => {
    if (accountName) {
      navigate(AppRoute.OnboardingImportKey, {
        state: { accountName },
      });
    } else {
      setError('Please provide an account name to generate wallets');
    }
  };

  return (
    <div className="max-w-lg xl:max-w-2xl m-auto pt-[100px]">
      <div className="flex flex-col pl-1 text-lg">
        <p className="mb-4">
          To ensure a fair playing field, every node is required to stake tokens
          as collateral.{' '}
          <Tooltip
            placement="top-right"
            tooltipContent={
              <div className="max-w-[250px] w-full text-xs leading=4">
                Staking refers to the act of locking up an amount of tokens as a
                guarantee for participating in a blockchain network.
              </div>
            }
          >
            <Icon
              source={TooltipChatQuestionLeftLine}
              className="h-4 w-4 text-finnieEmerald-light ml-0.5 cursor-pointer"
            />
          </Tooltip>
        </p>
        <p>Create a new account or import an existing one.</p>
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
          {error && <ErrorMessage error={error} />}
        </div>
      </div>

      <div className="mt-16 ">
        <div className="flex flex-row items-center justify-evenly">
          <div className="flex flex-col items-center">
            <button
              className="w-[180px] h-[180px] p-2 border-dashed border-finnieOrange rounded-full border-2 mb-4 cursor-pointer"
              onClick={handleClickCreate}
              disabled={!!error}
            >
              <div className="flex flex-col items-center justify-center w-full h-full rounded-full bg-finnieBlue-light-secondary">
                <Icon
                  source={CreateAccountSvg}
                  className="h-[65px] w-[65px] -mt-1"
                />
              </div>
            </button>
            <div>Create a New Account</div>
            <div className=" text-xs text-[#FFC78F]">
              Most people choose this option.
            </div>
          </div>

          <div className="flex flex-col items-center h-[236px]">
            <button
              className="w-[180px] h-[180px] p-2 border-2 border-dashed border-finnieTeal rounded-full mb-4 cursor-pointer z-30"
              onClick={handleClickImport}
              disabled={!!error}
            >
              <div className="flex flex-col items-center justify-center w-full h-full rounded-full bg-finnieBlue-light-secondary">
                <Icon source={SeedSecretPhraseXlLine} className="h-20 w-20" />
              </div>
            </button>
            Import Account
          </div>
        </div>
      </div>
    </div>
  );
}

export default memo(KeyCreationMethodPick);
