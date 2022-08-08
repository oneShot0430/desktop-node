import React from 'react';
import { useLocation } from 'react-router-dom';

import KoiiLogo from 'assets/svgs/koii-logo-white.svg';
import ClickIconSvg from 'assets/svgs/onboarding/click-icon.svg';
import CreateIconSvg from 'assets/svgs/onboarding/create-icon.svg';
import CurrencyIconSvg from 'assets/svgs/onboarding/currency-icon.svg';
import LockIconSvg from 'assets/svgs/onboarding/lock-icon.svg';
import { AppRoute } from 'webapp/routing/AppRoutes';

import StepListItem from './components/StepListItem';

type PropsType = {
  children: React.ReactNode;
};

const OnboardingLayout = ({ children }: PropsType) => {
  const { pathname } = useLocation();

  return (
    <div className="flex flex-row h-full text-white">
      <div className="w-[450px] bg-finnieBlue-light-secondary items-center  flex flex-col">
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
            isActive={pathname === AppRoute.OnboardingCreateOrImportKey}
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
        </div>
      </div>
      <div className="flex-grow">{children}</div>
    </div>
  );
};

export default OnboardingLayout;
