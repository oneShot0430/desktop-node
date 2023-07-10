import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

import { AppTopBar } from 'renderer/components/AppTopBar';
import {
  useNotificationsContext,
  NotificationBanner,
  NotificationPlacement,
} from 'renderer/features/notifications';
import { saveUserConfig, switchUpdateChannel } from 'renderer/services';
import { AppRoute } from 'renderer/types/routes';

import Header from '../Header';
import { Sidebar } from '../Sidebar';

type MainLayoutProps = {
  children: React.ReactNode;
};

function MainLayout({ children }: MainLayoutProps): JSX.Element {
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

      async switchToAlphaUpdates() {
        await switchUpdateChannel('alpha');
      },
    });
  }, [navigate]);

  return (
    <div className="flex flex-col flex-grow bg-gradient-to-b from-finnieBlue-dark-secondary to-finnieBlue min-h-screen min-w-fit overflow-x-hidden">
      <Header />
      <AppTopBar />
      <div className="flex flex-grow min-h-0 px-4 relative">
        <Sidebar />
        <div className="flex flex-col flex-grow min-h-0 pb-4">{children}</div>
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

export default MainLayout;
