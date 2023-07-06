// UpdateAvailableNotification

import {
  Icon,
  CloseLine,
  Button,
  ButtonVariant,
  ButtonSize,
} from '@_koii/koii-styleguide';
import React from 'react';
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

  const classNames = twMerge(
    'flex justify-between w-full px-4 mx-auto px-4 items-center gap-4',
    'bg-finnieTeal-100 text-finnieBlue'
  );

  const handleUpdateDownload = () => {
    setIsDownloading(true);
    downloadAppUpdate()
      .then(() => {
        setIsDownloading(false);
        removeNotificationById(id);
      })
      .catch((err) => {
        console.error(err);
        setIsDownloading(false);
      });
  };

  return (
    <div className={classNames}>
      {backButtonSlot}
      <div className="max-w-[65%]">
        A new version of the node is ready for you!
      </div>
      <div className="flex items-center gap-6 w-max">
        {isDownloading ? (
          'New version is downloading...'
        ) : (
          <Button
            label="Update Now"
            onClick={handleUpdateDownload}
            variant={ButtonVariant.GhostDark}
            size={ButtonSize.MD}
            labelClassesOverrides="font-semibold w-max"
          />
        )}

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
