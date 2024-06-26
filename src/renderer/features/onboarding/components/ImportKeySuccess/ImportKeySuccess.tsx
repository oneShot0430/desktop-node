import { Icon, CheckSuccessLine } from '@_koii/koii-styleguide';
import React from 'react';
import { useNavigate } from 'react-router-dom';

import { Button } from 'renderer/components/ui';
import { useFundNewAccountModal } from 'renderer/features/common';
import { AppRoute } from 'renderer/types/routes';

import { useOnboardingContext } from '../../context/onboarding-context';

function ImportKeySuccess() {
  const navigate = useNavigate();
  const { systemKey } = useOnboardingContext();

  const maskedKey = systemKey
    ? `${systemKey.substring(0, 22)}...${systemKey
        .trim()
        .substring(systemKey.length - 5)}`
    : '';

  const { showModal } = useFundNewAccountModal();

  const handleContinue = () => {
    showModal().then(() => {
      navigate(AppRoute.OnboardingSeeBalance);
    });
  };

  return (
    <div className="flex pl-[105px]">
      <div className="flex flex-col items-center pt-[240px]">
        <div className="w-[348px] h-[172px] bg-finnieBlue-light-secondary rounded-sm mb-10 p-4">
          <div className="flex flex-row items-center">
            <div className="text-finnieEmerald">
              <Icon source={CheckSuccessLine} className="h-16 w-16 m-3" />
            </div>
            Your account was successfully imported!
          </div>
          <div
            title={systemKey}
            className="pl-4 text-finnieEmerald-light w-[75%] text-elipsis"
          >
            {maskedKey}
          </div>
        </div>
        <Button
          label="Next"
          className="font-semibold bg-finnieGray-light text-finnieBlue-light w-[240px] h-[48px]"
          onClick={handleContinue}
        />
      </div>
    </div>
  );
}

export default ImportKeySuccess;
