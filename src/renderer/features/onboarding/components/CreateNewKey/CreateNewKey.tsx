import { CheckSuccessLine, Icon } from '@_koii/koii-styleguide';
import React from 'react';
import { useNavigate } from 'react-router-dom';

import { Button } from 'renderer/components/ui';
import { useFundNewAccountModal } from 'renderer/features/common';
import { AppRoute } from 'renderer/types/routes';

import { ContentRightWrapper } from '../ContentRightWrapper';

const CreateNewKey = () => {
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
        <p>Back up your account now or skip to fund your account</p>
        <p>and start running tasks right away.</p>

        <p className="mt-4">You can back up your secret phrase at any time.</p>
      </div>

      <div className="flex justify-between w-full gap-10 mt-6">
        <Button
          label="Back Up Now"
          onClick={() => navigate(AppRoute.OnboardingBackupKeyNow)}
          className="font-semibold bg-transparent text-white w-[240px] h-[48px] border border-white"
        />

        <Button
          label="Fund Key"
          onClick={handleOpenQR}
          className="font-semibold bg-finnieGray-light text-finnieBlue-light w-[240px] h-[48px]"
        />
      </div>
    </ContentRightWrapper>
  );
};

export default CreateNewKey;
