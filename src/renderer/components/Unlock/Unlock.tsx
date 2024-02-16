import { Icon } from '@_koii/koii-styleguide';
import { compare } from 'bcryptjs';
import React, { useEffect, useRef, useState } from 'react';
import { useQueryClient } from 'react-query';
import { useNavigate } from 'react-router-dom';

import KoiiLogo from 'assets/svgs/koii-logo-white.svg';
import WelcomeLinesDiagonal from 'assets/svgs/welcome-lines-diagonal.svg';
import WelcomeWheelBackground from 'assets/svgs/welcome-wheel-background.svg';
import { LoadingScreen } from 'renderer/components/LoadingScreen';
import { PinInput } from 'renderer/components/PinInput';
import { useEmergencyMigrationModal } from 'renderer/features/common';
import { useUserAppConfig } from 'renderer/features/settings/hooks';
import {
  QueryKeys,
  getAllAccounts,
  getUserConfig,
  initializeTasks,
} from 'renderer/services';
import { AppRoute } from 'renderer/types/routes';

export function Unlock(): JSX.Element {
  const [hasPinError, setHasPinError] = useState<boolean>(false);

  const [initializingNode, setInitializingNode] = useState(true);

  const queryClient = useQueryClient();

  const { userConfig: settings, isUserConfigLoading: loadingSettings } =
    useUserAppConfig();

  const migrationPhase = settings?.hasStartedEmergencyMigration ? 2 : 1;

  const navigate = useNavigate();

  const { showModal: showEmergencyMigrationModal } = useEmergencyMigrationModal(
    { migrationPhase }
  );

  const handlePinChange = async (enteredPin: string) => {
    setHasPinError(false);
    const finishedTypingPin = enteredPin.length === 6;

    if (finishedTypingPin) {
      const pinMatchesStoredHash = await compare(
        enteredPin,
        settings?.pin || ''
      );

      if (pinMatchesStoredHash) {
        if (!settings?.hasFinishedEmergencyMigration) {
          showEmergencyMigrationModal();
        }

        navigate(AppRoute.MyNode, { state: { noBackButton: true } });
      } else {
        setHasPinError(true);
      }
    }
  };

  const initializeNodeCalled = useRef(false);

  useEffect(() => {
    const initializeNode = async () => {
      if (initializeNodeCalled.current) {
        return; // If already called, skip the initialization
      }
      initializeNodeCalled.current = true;
      console.log('Initializing node...');
      try {
        // Indicate the initialization API call in sessionStorage
        await initializeTasks();
        setInitializingNode(false);
      } catch (error: any) {
        console.error(error);
      }
    };

    const shouldInitializeNode =
      !loadingSettings && settings?.hasFinishedEmergencyMigration;

    if (shouldInitializeNode) {
      initializeNode();
    } else {
      setInitializingNode(false);
    }
  }, [settings?.hasFinishedEmergencyMigration, loadingSettings]);

  // started prefetching required data while node is initializing
  useEffect(() => {
    const prefetchQueries = async () => {
      try {
        await Promise.all([
          queryClient.prefetchQuery({
            queryKey: [QueryKeys.UserSettings],
            queryFn: getUserConfig,
          }),
          queryClient.prefetchQuery({
            queryKey: [QueryKeys.Accounts],
            queryFn: getAllAccounts,
          }),
        ]);
      } catch (error: any) {
        console.error(error);
      }
    };

    prefetchQueries();
  }, [queryClient]);

  if (initializingNode) {
    return <LoadingScreen />;
  }

  return (
    <div className="relative flex flex-col items-center justify-center h-full gap-5 overflow-hidden overflow-y-auto text-white bg-gradient-to-b from-finnieBlue-dark-secondary to-finnieBlue">
      <WelcomeWheelBackground className="absolute top-0 -left-[40%] h-[40%] scale-110" />

      <Icon source={KoiiLogo} className="h-[156px] w-[156px]" />
      <h1 className="text-[40px] leading-[48px] text-center">
        Welcome to the Koii Node
      </h1>
      <p className="text-lg text-center">
        Enter your security PIN code to unlock your Node
      </p>

      <PinInput
        focus
        onChange={handlePinChange}
        showHideButton
        showHideIconSize={28}
      />
      <div className="h-4 text-xs text-finnieOrange">
        {hasPinError && (
          <span>
            Oops! That PIN isn’t quite right. Double check it and try again.
          </span>
        )}
      </div>

      <WelcomeLinesDiagonal className="absolute bottom-0 -right-[22.5%] h-full" />
    </div>
  );
}
