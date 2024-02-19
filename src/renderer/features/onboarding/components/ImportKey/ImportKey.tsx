/* eslint-disable react/no-unescaped-entities */
import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

import {
  ImportFromSeedPhrase,
  AccountsType,
} from 'renderer/components/ImportFromSeedPhrase';
import { Tooltip } from 'renderer/components/ui';
import { Theme } from 'renderer/types/common';
import { AppRoute } from 'renderer/types/routes';

import { useOnboardingContext } from '../../context/onboarding-context';
import { ContentRightWrapper } from '../ContentRightWrapper';

type LocationStateType = {
  accountName: string;
};

function ImportKey() {
  const navigate = useNavigate();
  const { setSystemKey, appPin } = useOnboardingContext();
  const location = useLocation();
  const { accountName } = location.state as LocationStateType;

  const handleImportSuccess = ({ mainAccountPubKey }: AccountsType) => {
    setSystemKey(mainAccountPubKey);
    navigate(AppRoute.OnboardingPhraseImportSuccess);
  };

  return (
    <div className="flex flex-col items-start">
      <ContentRightWrapper>
        <div className="flex flex-col items-start">
          <div className="mb-10 text-lg">
            <span>Type in your</span>{' '}
            <Tooltip
              theme={Theme.Dark}
              tooltipContent={
                <>
                  <span>Sometimes known as a "seed phrase"</span>{' '}
                  <span>or a "recovery phrase"</span>
                </>
              }
            >
              <span className="underline cursor-pointer underline-offset-4">
                secret phrase
              </span>
            </Tooltip>
            <span> to import your key.</span>
          </div>
          <ImportFromSeedPhrase
            accountName={accountName}
            setImportedWalletAsDefault
            onImportSuccess={handleImportSuccess}
            confirmActionLabel="Confirm"
            appPin={appPin}
          />
        </div>
      </ContentRightWrapper>
    </div>
  );
}

export default ImportKey;
