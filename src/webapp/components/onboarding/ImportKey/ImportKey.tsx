import React, { useContext } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

import { ImportFromSeedPhrase } from 'webapp/components/ImportFromSeedPhrase';
import { AppRoute } from 'webapp/routing/AppRoutes';

import { OnboardingContext } from '../context/onboarding-context';

type LocationStateType = {
  accountName: string;
};

const ImportKey = () => {
  const navigate = useNavigate();
  const { setSystemKey } = useContext(OnboardingContext);
  const location = useLocation();
  const { accountName } = location.state as LocationStateType;

  return (
    <div className="flex flex-col items-start pl-[100px] pt-[140px]">
      <div className="text-lg pl-[42px] mb-10">
        Type in your secret phrase to import your key.
      </div>
      <ImportFromSeedPhrase
        accountName={accountName}
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
