import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

import BackIconComponent from 'assets/svgs/back-icon.svg';
import KoiiLogo from 'assets/svgs/koii-logo-white.svg';
import ClickIconSvg from 'assets/svgs/onboarding/click-icon.svg';
import CreateIconSvg from 'assets/svgs/onboarding/create-icon.svg';
import CurrencyIconSvg from 'assets/svgs/onboarding/currency-icon.svg';
import LockIconSvg from 'assets/svgs/onboarding/lock-icon.svg';
import { Button } from 'webapp/components/ui/Button';
import { AppRoute } from 'webapp/routing/AppRoutes';

import StepListItem from './components/StepListItem';

type PropsType = {
  children: React.ReactNode;
};

const OnboardingLayout = ({ children }: PropsType) => {
  const { pathname } = useLocation();
  const navigate = useNavigate();

  const handleBackButtonClick = () => {
    navigate(-1);
  };

  return (
    <div className="flex flex-row h-full text-white">
      <div className="w-[650px] bg-finnieBlue-light-secondary items-center flex flex-col relative">
        <BackIconComponent
          data-testid="close-modal-button"
          onClick={handleBackButtonClick}
          className="w-[36px] h-[36px] cursor-pointer absolute top-[20px] left-[20px]"
        />
        <div className="flex flex-col items-center justify-center mb-14">
          <KoiiLogo />
          <div className="text-[40px] w-[75%] text-center">
            Welcome to the Koii Node
          </div>
          <div className="text-finnieEmerald">
            Get set up in just 4 quick & easy steps.
          </div>
        </div>

        <div className="flex flex-col gap-3 w-max">
          <StepListItem
            isActive={pathname === AppRoute.OnboardingCreatePin}
            text="Secure your Node with a PIN."
            iconSlot={<LockIconSvg />}
          />
          <StepListItem
            isActive={pathname.includes('create-or-import-key')}
            text="Fund your new key or import one."
            iconSlot={<CurrencyIconSvg />}
          />
          <StepListItem
            isActive={pathname === AppRoute.OnboardingCreateFirstTask}
            text="Select your first tasks."
            iconSlot={<CreateIconSvg />}
          />
          <StepListItem
            isActive={pathname === AppRoute.OnboardingConfirmStake}
            text="Confirm your stake and go!"
            iconSlot={<ClickIconSvg />}
          />
          <div className="absolute bottom-2 left-2">
            <Button
              label="Skip"
              className="underline text-finnieEmerald-light"
              onClick={() => {
                navigate(AppRoute.MyNode);
              }}
            />
          </div>
        </div>
      </div>
      <div className="w-full">{children}</div>
    </div>
  );
};

export default OnboardingLayout;
