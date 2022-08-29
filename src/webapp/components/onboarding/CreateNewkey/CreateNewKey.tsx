import React from 'react';
import { useNavigate } from 'react-router-dom';

import CheckMarkIcon from 'assets/svgs/checkmark-icon.svg';
import { Button } from 'webapp/components/ui/Button';
import { AppRoute } from 'webapp/routing/AppRoutes';

const CreateNewKey = () => {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col items-center mt-[180px] px-[105px] w-full">
      <div className="flex items-center justify-start w-full gap-4 text-2xl ml-[-28px] mb-4 font-semibold">
        <CheckMarkIcon className="text-finnieEmerald-light" />
        New Account Created
      </div>

      <div className="w-full">
        <p>Back up your account now or skip to fund your account</p>
        <p>and start running tasks right away.</p>

        <p className="mt-4">You can back up your secret phrase at any time.</p>
      </div>

      <div className="flex justify-between w-full mt-6">
        <Button
          label="Back Up Now"
          onClick={() => navigate(AppRoute.OnboardingBackupKeyNow)}
          className="font-semibold bg-transparent text-white w-[240px] h-[48px] border border-white"
        />
        {/* TODO: Navigate to 'AppRoute.OnboardingBackupKeyLater' when it's ready */}
        <Button
          label="Back Up Later"
          onClick={() => navigate(AppRoute.OnboardingFundNewKey)}
          // onClick={() => navigate(AppRoute.OnboardingCreateFirstTask)}
          className="font-semibold bg-finnieGray-light text-finnieBlue-light w-[240px] h-[48px]"
        />
      </div>
    </div>
  );
};

export default CreateNewKey;
