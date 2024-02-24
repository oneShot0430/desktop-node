import React, { useEffect, useMemo } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

import Background from 'assets/svgs/background.svg';
import { AppTopBar } from 'renderer/components/AppTopBar';
import { SettingsSidebar } from 'renderer/features';
import { useWindowSize } from 'renderer/features/common/hooks/useWindowSize';
import { K2StatusIndicator } from 'renderer/features/network';
import { useNetworkStatusContext } from 'renderer/features/network/context/NetworkStatusContext';
import {
  DisplayBottomNotifications,
  useNotificationBanner,
} from 'renderer/features/notifications';
import { Sidebar } from 'renderer/features/sidebar';
import { VersionDisplay } from 'renderer/features/sidebar/components';
import { saveUserConfig } from 'renderer/services';
import { AppRoute } from 'renderer/types/routes';

import Header from '../Header';

type MainLayoutProps = {
  children: React.ReactNode;
};

export function MainLayout({ children }: MainLayoutProps): JSX.Element {
  const { k2RateLimitError, setK2RateLimitError } = useNetworkStatusContext();
  const { unreadNotificationsWithBannerBottom } = useNotificationBanner();
  const navigate = useNavigate();
  const location = useLocation();

  // TODO: Remove after release
  useEffect(() => {
    Object.assign(window, {
      async resetOnboarding() {
        await saveUserConfig({
          settings: { onboardingCompleted: false },
        });
        navigate(AppRoute.OnboardingCreatePin);
      },
    });
  }, [navigate]);

  const isSettingsView = useMemo(
    () => location.pathname.includes(AppRoute.Settings),
    [location]
  );

  const { height } = useWindowSize();

  return (
    <div className="relative flex flex-col flex-grow min-h-screen overflow-x-hidden overflow-y-hidden bg-gradient-to-b from-finnieBlue-dark-secondary to-finnieBlue min-w-fit">
      <Background
        preserveAspectRatio="xMidYMid meet"
        className="absolute left-0 right-0 w-full h-auto mx-auto top-[110px]"
      />

      <Header />
      <AppTopBar />
      <div className="relative flex flex-grow min-h-0 px-4 pt-3 mt-1 bg-gradient-dark bg-opacity-10">
        {isSettingsView ? <SettingsSidebar /> : <Sidebar />}
        <div className="flex flex-col flex-grow min-h-0 h-[calc(100vh-172px)] pb-4 z-10">
          {children}
        </div>
        <DisplayBottomNotifications
          bottomNotifications={unreadNotificationsWithBannerBottom}
        />
      </div>

      {Number(height) >= 820 && !k2RateLimitError && (
        <div className="absolute bottom-0 right-0">
          <VersionDisplay />
        </div>
      )}

      {k2RateLimitError && (
        <div className="absolute bottom-0 right-0 z-50">
          <K2StatusIndicator
            status="K2RateLimitExceeded"
            onClose={() => {
              setK2RateLimitError(false);
            }}
          />
        </div>
      )}
    </div>
  );
}
