import {
  Icon,
  CurrencyMoneyLine,
  ClickXlLine,
  WebCursorXlLine,
  LockLine,
  ChevronArrowLine,
} from '@_koii/koii-styleguide';
import React, { useMemo } from 'react';

import KoiiLogo from 'assets/svgs/koii-logo-white.svg';
import { Button } from 'renderer/components/ui/Button';
import {
  AppNotification,
  useNotificationsContext,
} from 'renderer/features/notifications';
import { useMainAccount, useUserAppConfig } from 'renderer/features/settings';
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

  const { data: mainAccountPubKey } = useMainAccount();

  const { addNotification } = useNotificationsContext();

  const displaySkipButton = useMemo(
    () => currentPath !== AppRoute.OnboardingCreatePin && mainAccountPubKey,
    [currentPath, mainAccountPubKey]
  );

  const { handleSaveUserAppConfig } = useUserAppConfig({
    onConfigSaveSuccess: () => {
      navigate(AppRoute.MyNode, { state: { noBackButton: true } });
      addNotification(
        'referralProgramNotification',
        AppNotification.ReferalProgramNotification
      );
    },
  });

  const handleSkipOnboarding = () =>
    handleSaveUserAppConfig({ settings: { onboardingCompleted: true } });

  return (
    <div className="flex flex-row h-full text-white">
      <div className="w-[650px] bg-finnieBlue-light-secondary items-center flex flex-col relative">
        {showOnboardingBackButton && (
          <Icon
            source={ChevronArrowLine}
            className="absolute -rotate-90 cursor-pointer w-9 h-9 top-5 left-5"
            onClick={handleBackButtonClick}
          />
        )}
        <div className="flex flex-col items-center justify-center mb-14">
          <Icon source={KoiiLogo} className="h-[156px] w-[156px]" />
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
            iconSlot={<Icon source={LockLine} className="m-1 h-9 w-9" />}
          />
          <StepListItem
            isActive={currentPath.includes('create-or-import-key')}
            text="Fund your new key or import one."
            iconSlot={
              <Icon source={CurrencyMoneyLine} className="m-1 h-9 w-9" />
            }
          />
          <StepListItem
            isActive={currentPath === AppRoute.OnboardingCreateFirstTask}
            text="Select your first tasks."
            iconSlot={<Icon source={WebCursorXlLine} className="m-1 h-9 w-9" />}
          />
          <StepListItem
            isActive={currentPath === AppRoute.OnboardingConfirmStake}
            text="Confirm your stake and go!"
            iconSlot={<Icon source={ClickXlLine} className="m-1 h-9 w-9" />}
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
