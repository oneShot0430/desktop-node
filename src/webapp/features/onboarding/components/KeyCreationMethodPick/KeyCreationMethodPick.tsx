import React, { memo, useContext, useState } from 'react';
import { useMutation } from 'react-query';
import { useNavigate } from 'react-router-dom';

import RewardsSvg from 'assets/svgs/onboarding/rewards-icon.svg';
import SeedPhraseSvg from 'assets/svgs/onboarding/seed-phrase-icon.svg';
import { AppRoute } from 'webapp/routing/AppRoutes';
import {
  createNodeWallets,
  generateSeedPhrase,
  setActiveAccount,
} from 'webapp/services';

import { OnboardingContext } from '../../context/onboarding-context';

const KeyCreationMethodPick = () => {
  const [inputValue, setInputValue] = useState('');
  const navigate = useNavigate();
  const { setNewSeedPhrase, setSystemKey } = useContext(OnboardingContext);

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

  return (
    <div className="px-[100px] pt-[100px]">
      <div className="flex flex-col text-lg ">
        <p className="mb-4">
          To make sure everyone is playing fairly, each node must
          <br /> stake tokens as collateral.
        </p>
        <p>Create a new account or import an existing Koii key.</p>
      </div>

      <div className="px-12 my-8">
        <div className="px-[20px] text-left leading-8 mb-2">Account name</div>
        <input
          className="w-full px-6 py-2 rounded-md bg-finnieBlue-light-tertiary "
          type="text"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          placeholder="Account name"
        />
      </div>

      <div className="mt-16 ">
        <div className="flex flex-row items-center justify-center gap-16">
          <div className="flex flex-col items-center">
            <div
              className="w-[180px] h-[180px] p-2 border-dashed border-finnieOrange rounded-full border-2 mb-4 cursor-pointer"
              onClick={() => seedPhraseGenerateMutation.mutate(inputValue)}
            >
              <div className="flex flex-col items-center justify-center w-full h-full rounded-full bg-finnieBlue-light-secondary">
                <RewardsSvg />
              </div>
            </div>
            Create a New Account
          </div>

          <div className="flex flex-col items-center">
            <div
              className="w-[180px] h-[180px] p-2 border-2 border-dashed border-finnieTeal rounded-full mb-4 cursor-pointer z-30"
              onClick={() =>
                navigate(AppRoute.OnboardingImportKey, {
                  state: { accountName: inputValue },
                })
              }
            >
              <div className="flex flex-col items-center justify-center w-full h-full rounded-full bg-finnieBlue-light-secondary">
                <SeedPhraseSvg />
              </div>
            </div>
            Import Account
          </div>
        </div>
      </div>
    </div>
  );
};

export default memo(KeyCreationMethodPick);
