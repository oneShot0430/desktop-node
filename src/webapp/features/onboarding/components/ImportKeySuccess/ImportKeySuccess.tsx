import React, { useContext } from 'react';
import { useNavigate } from 'react-router-dom';

import CheckMarkIcon from 'assets/svgs/checkmark-icon.svg';
import { Button } from 'webapp/components/ui/Button';
import { AppRoute } from 'webapp/routing/AppRoutes';

import { OnboardingContext } from '../../context/onboarding-context';

const ImportKeySuccess = () => {
  const navigate = useNavigate();
  const { systemKey } = useContext(OnboardingContext);

  const maskedKey = systemKey
    ? systemKey.substring(0, 22) +
      '...' +
      systemKey.trim().substring(systemKey.length - 5)
    : '';

  return (
    <div className="flex pl-[105px]">
      <div className="flex flex-col items-center pt-[240px]">
        <div className="w-[348px] h-[172px] bg-finnieBlue-light-secondary rounded-sm mb-10 p-4">
          <div className="flex flex-row items-center">
            <div className="text-finnieEmerald">
              <CheckMarkIcon />
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
          onClick={() => navigate(AppRoute.OnboardingCreateFirstTask)}
        />
      </div>
    </div>
  );
};

export default ImportKeySuccess;
