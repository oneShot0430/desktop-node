import React from 'react';

import { AppNotification, NotificationBanner } from '../NotificationBanner';

// import { BackButton } from '../BackButton';

export const AppTopBar = () => {
  return (
    <div className="flex justify-between w-full mx-auto h-[80px] py-2">
      {/* <BackButton /> */}
      <NotificationBanner variant={AppNotification.FirstNodeReward} />
    </div>
  );
};
