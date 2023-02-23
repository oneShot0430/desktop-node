import {
  CurrencyMoneyLine,
  ClickXlLine,
  WebCursorXlLine,
  LockLine,
  Icon,
} from '@_koii/koii-styleguide';
import React, { useMemo } from 'react';
import { useLocation } from 'react-router-dom';

import BackIconComponent from 'assets/svgs/back-icon.svg';
import KoiiLogo from 'assets/svgs/koii-logo-white.svg';
import { Button } from 'renderer/components/ui';
import { useUserAppConfig } from 'renderer/features';
import { AppRoute } from 'renderer/types/routes';

import { useBackButtonHandler } from '../../hooks/useBackButtonHandler';

import StepListItem from './components/StepListItem';

type PropsType = {
  children: React.ReactNode;
};

function OnboardingLayout({ children }: PropsType) {
  const {
    handleBackButtonClick,
    showOnboardingBackButton,
    currentPath,
    navigate,
  } = useBackButtonHandler();

  const location = useLocation();
  const displaySkipButton = useMemo(
    () => location.pathname !== AppRoute.OnboardingCreatePin,
    [location.pathname]
  );

  const { handleSaveUserAppConfig } = useUserAppConfig({
    onConfigSaveSuccess: () =>
      navigate(AppRoute.MyNode, { state: { noBackButton: true } }),
  });

  const handleSkipOnboarding = () =>
    handleSaveUserAppConfig({ settings: { onboardingCompleted: true } });

  return (
    <div className="flex flex-row h-full text-white">
      <div className="w-[650px] bg-finnieBlue-light-secondary items-center flex flex-col relative">
        {showOnboardingBackButton && (
          <BackIconComponent
            data-testid="close-modal-button"
            onClick={handleBackButtonClick}
            className="w-9 h-9 cursor-pointer absolute top-[20px] left-[20px]"
          />
        )}
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
            isActive={currentPath === AppRoute.OnboardingCreatePin}
            text="Secure your Node with a PIN."
            iconSlot={<Icon source={LockLine} className="h-9 w-9 m-1" />}
          />
          <StepListItem
            isActive={currentPath.includes('create-or-import-key')}
            text="Fund your new key or import one."
            iconSlot={
              <Icon source={CurrencyMoneyLine} className="h-9 w-9 m-1" />
            }
          />
          <StepListItem
            isActive={currentPath === AppRoute.OnboardingCreateFirstTask}
            text="Select your first tasks."
            iconSlot={<Icon source={WebCursorXlLine} className="h-9 w-9 m-1" />}
          />
          <StepListItem
            isActive={currentPath === AppRoute.OnboardingConfirmStake}
            text="Confirm your stake and go!"
            iconSlot={<Icon source={ClickXlLine} className="h-9 w-9 m-1" />}
          />
          <div className="absolute bottom-2 left-2">
            {displaySkipButton && (
              <Button
                label="Skip"
                className="underline text-finnieEmerald-light"
                onClick={handleSkipOnboarding}
              />
            )}
          </div>
        </div>
      </div>
      <div className="w-full">{children}</div>
    </div>
  );
}

export default OnboardingLayout;
