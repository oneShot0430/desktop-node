import { CheckSuccessLine, Icon } from '@_koii/koii-styleguide';
import React from 'react';
import { useNavigate } from 'react-router-dom';

import { Button } from 'renderer/components/ui';
import { useFundNewAccountModal } from 'renderer/features/common';
import { AppRoute } from 'renderer/types/routes';

import { ContentRightWrapper } from '../ContentRightWrapper';

function CreateNewKey() {
  const navigate = useNavigate();
  const { showModal } = useFundNewAccountModal();

  const handleOpenQR = () => {
    showModal().then(() => {
      navigate(AppRoute.OnboardingSeeBalance);
    });
  };

  return (
    <ContentRightWrapper>
      <div className="flex items-center justify-start w-full gap-4 text-2xl ml-[-28px] mb-4 font-semibold">
        <Icon
          source={CheckSuccessLine}
          className="text-finnieEmerald-light h-16 w-16 m-2"
        />
        New Account Created
      </div>

      <div className="w-full">
        <p>Fund your account with free tokens from the Koii</p>
        <p>Faucet and start running tasks right away.</p>

        <p className="mt-4">You can back up your secret phrase at any time.</p>
      </div>

      <div className="flex flex-col items-center justify-between w-full gap-4 mt-6">
        <Button
          label="Fund Account"
          onClick={handleOpenQR}
          className="font-semibold bg-finnieGray-light text-finnieBlue-light w-[260px] h-[48px]"
        />
        <Button
          label="Back Up My Secret Phrase"
          onClick={() => navigate(AppRoute.OnboardingBackupKeyNow)}
          className="font-semibold bg-transparent text-white w-auto h-[48px] px-6 py-[14px] underline hover:border-2 hover:border-white"
        />
      </div>
    </ContentRightWrapper>
  );
}

export default CreateNewKey;
