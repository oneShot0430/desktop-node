// UpdateAvailableNotification

import {
  Icon,
  CloseLine,
  Button,
  ButtonVariant,
  ButtonSize,
} from '@_koii/koii-styleguide';
import React, { useEffect } from 'react';
import { twMerge } from 'tailwind-merge';

import { downloadAppUpdate } from 'renderer/services';

import { useNotificationsContext } from '../context';

export function UpdateAvailableNotification({
  id,
  backButtonSlot,
}: {
  id: string;
  backButtonSlot?: React.ReactNode;
}) {
  const { removeNotificationById } = useNotificationsContext();
  const [isDownloading, setIsDownloading] = React.useState(false);
  const [isDownloaded, setIsDownloaded] = React.useState(false);

  useEffect(() => {
    const destroy = window.main.onAppDownloaded(() => {
      setIsDownloading(() => false);
      setIsDownloaded(() => true);

      setTimeout(() => {
        removeNotificationById(id);
      }, 5000);
    });

    return () => {
      destroy();
    };
  }, [id, isDownloaded, removeNotificationById]);

  const classNames = twMerge(
    'flex justify-between w-full px-4 mx-auto px-4 items-center gap-4',
    'bg-finnieTeal-100 text-finnieBlue'
  );

  const handleUpdateDownload = () => {
    setIsDownloading(true);
    downloadAppUpdate().catch((err) => {
      console.error(err);
    });
  };

  const getContent = () => {
    if (isDownloading) {
      return 'New version is downloading...';
    }

    if (isDownloaded) {
      return 'New version is ready to install!';
    }

    return (
      <Button
        label="Update Now"
        onClick={handleUpdateDownload}
        variant={ButtonVariant.GhostDark}
        size={ButtonSize.MD}
        labelClassesOverrides="font-semibold w-max"
      />
    );
  };

  const showBannerMianContent = !isDownloading && !isDownloaded;

  return (
    <div className={classNames}>
      {backButtonSlot}
      <div className="max-w-[65%]">
        {showBannerMianContent && 'A new version of the node is ready for you!'}
      </div>
      <div className="flex items-center gap-6 w-max">
        {getContent()}
        <button
          className="cursor-pointer"
          title="close"
          onClick={() => removeNotificationById(id)}
        >
          <Icon source={CloseLine} className="h-9 w-9" />
        </button>
      </div>
    </div>
  );
}
