import React, { useContext } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

import { ImportFromSeedPhrase } from 'webapp/components/ImportFromSeedPhrase';
import { AppRoute } from 'webapp/types/routes';

import { OnboardingContext } from '../../context/onboarding-context';
import { ContentRightWrapper } from '../ContentRightWrapper';

type LocationStateType = {
  accountName: string;
};

const ImportKey = () => {
  const navigate = useNavigate();
  const { setSystemKey } = useContext(OnboardingContext);
  const location = useLocation();
  const { accountName } = location.state as LocationStateType;

  return (
    <div className="flex flex-col items-start">
      <ContentRightWrapper>
        <div className="flex flex-col items-start">
          <div className="mb-10 text-lg">
            <span>Type in your</span>{' '}
            <span className="underline cursor-pointer underline-offset-4">
              secret phrase
            </span>{' '}
            <span>to import your key.</span>
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
      </ContentRightWrapper>
    </div>
  );
};

export default ImportKey;
