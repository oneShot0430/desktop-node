import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

import Background from 'assets/svgs/background.svg';
import { AppTopBar } from 'renderer/components/AppTopBar';
import {
  useNotificationsContext,
  NotificationBanner,
  NotificationPlacement,
} from 'renderer/features/notifications';
import { Sidebar } from 'renderer/features/sidebar';
import { saveUserConfig } from 'renderer/services';
import { AppRoute } from 'renderer/types/routes';

import Header from '../Header';

type MainLayoutProps = {
  children: React.ReactNode;
};

export function MainLayout({ children }: MainLayoutProps): JSX.Element {
  const navigate = useNavigate();

  const { getNextNotification } = useNotificationsContext();

  // Get the first entry
  const displayedNotificationEntry = getNextNotification(
    NotificationPlacement.Bottom
  );

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

  return (
    <div className="relative flex flex-col flex-grow min-h-screen overflow-x-hidden overflow-y-hidden bg-gradient-to-b from-finnieBlue-dark-secondary to-finnieBlue min-w-fit">
      <Background
        preserveAspectRatio="xMidYMid meet"
        className="absolute left-0 right-0 w-full h-auto mx-auto top-[110px]"
      />

      <Header />
      <AppTopBar />
      <div className="relative flex flex-grow min-h-0 px-4 pt-3 mt-1 bg-gradient-dark bg-opacity-10">
        <Sidebar />
        <div className="flex flex-col flex-grow min-h-0 h-[calc(100vh-172px)] pb-4 z-10">
          {children}
        </div>
        {displayedNotificationEntry && (
          <NotificationBanner
            id={displayedNotificationEntry.id}
            variant={displayedNotificationEntry.notification}
          />
        )}
      </div>
    </div>
  );
}
