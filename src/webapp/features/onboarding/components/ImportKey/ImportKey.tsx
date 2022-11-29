/* eslint-disable react/no-unescaped-entities */
import React, { useContext } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

import { Tooltip } from 'webapp/components';
import {
  ImportFromSeedPhrase,
  AccountsType,
} from 'webapp/components/ImportFromSeedPhrase';
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
                  <span>Sometimes known as a "seed phrase"</span>
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
          />
        </div>
      </ContentRightWrapper>
    </div>
  );
};

export default ImportKey;
