import React, { memo, useContext } from 'react';
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

import { OnboardingContext } from '../context/onboarding-context';

const KeyCreationMethodPick = () => {
  const navigate = useNavigate();
  const { setNewSeedPhrase, setSystemKey } = useContext(OnboardingContext);

  const createNewKey = async () => {
    const accountName = `Account ${Math.random().toString().substring(2, 8)}`;

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
    <>
      <div className="text-lg mt-[140px] flex flex-col px-[100px]">
        <p className="mb-4">
          To make sure everyone is playing fairly, each node must
          <br /> stake tokens as collateral.
        </p>
        <p>Create a new account or import an existing Koii key.</p>
      </div>

      <div className="mt-16">
        <div className="flex flex-row items-center justify-center gap-16">
          <div className="flex flex-col items-center">
            <div
              className="w-[180px] h-[180px] p-2 border-dashed border-finnieOrange rounded-full border-2 mb-4 cursor-pointer"
              onClick={() => seedPhraseGenerateMutation.mutate()}
            >
              <div className="flex flex-col items-center justify-center w-full h-full rounded-full bg-finnieBlue-light-secondary">
                <RewardsSvg />
              </div>
            </div>
            Create a New Account
          </div>

          <div className="flex flex-col items-center">
            <div
              className="w-[180px] h-[180px] p-2 border-2 border-dashed border-finnieTeal rounded-full mb-4 cursor-pointer"
              onClick={() => navigate(AppRoute.OnboardingImportKey)}
            >
              <div className="flex flex-col items-center justify-center w-full h-full rounded-full bg-finnieBlue-light-secondary">
                <SeedPhraseSvg />
              </div>
            </div>
            Import Account
          </div>
        </div>
      </div>
    </>
  );
};

export default memo(KeyCreationMethodPick);
