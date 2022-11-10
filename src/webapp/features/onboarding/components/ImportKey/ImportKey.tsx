import React, { useContext } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

import { ImportFromSeedPhrase } from 'webapp/components/ImportFromSeedPhrase';
import { Tooltip } from 'webapp/components/ui/Tooltip/Tooltip';
import { Theme } from 'webapp/types/common';
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
            <Tooltip
              theme={Theme.Dark}
              tooltipContent={
                <>
                  <span>{'Sometimes known as a "seed phrase" '}</span>
                  <span>{'or a "recovery spanhrase"'}</span>
                </>
              }
              // manualClose
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
