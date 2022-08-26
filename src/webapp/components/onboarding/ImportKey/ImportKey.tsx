import React, { useContext } from 'react';
import { useNavigate } from 'react-router-dom';

import { ImportFromSeedPhrase } from 'webapp/components/ImportFromSeedPhrase';
import { AppRoute } from 'webapp/routing/AppRoutes';

import { OnboardingContext } from '../context/onboarding-context';

const ImportKey = () => {
  const navigate = useNavigate();
  const { setSystemKey } = useContext(OnboardingContext);

  return (
    <div className="mt-[140px] flex flex-col items-start pl-[100px]">
      <div className="text-lg pl-[42px] mb-10">
        Type in your secret phrase to import your key.
      </div>
      <ImportFromSeedPhrase
        setImportedWalletAsDefault
        onImportSuccess={({ mainAccountPubKey }) => {
          setSystemKey(mainAccountPubKey);
          navigate(AppRoute.OnboardingPhraseImportSuccess);
        }}
        confirmActionLabel="Confirm"
      />
    </div>
  );
};

export default ImportKey;
