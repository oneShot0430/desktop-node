import {
  Icon,
  CloseLine,
  Button,
  ButtonVariant,
  ButtonSize,
} from '@_koii/koii-styleguide';
import React, { useCallback } from 'react';
import { twMerge } from 'tailwind-merge';

import { useRunExemptionFlowModal } from 'renderer/features/common';

import { useNotificationsContext } from '../context';

export function RentExemptionFlowBanner({
  id,
  backButtonSlot,
}: {
  id: string;
  backButtonSlot?: React.ReactNode;
}) {
  const { removeNotificationById } = useNotificationsContext();
  const { showModal: showExemtionFlowModa } = useRunExemptionFlowModal();

  const handleLearnMoreClick = useCallback(() => {
    showExemtionFlowModa();
    removeNotificationById(id);
  }, [id, removeNotificationById, showExemtionFlowModa]);

  const classNames = twMerge(
    'flex justify-between w-full px-4 mx-auto px-4 items-center gap-4',
    'bg-finnieTeal text-finnieBlue'
  );

  return (
    <div className={classNames}>
      {backButtonSlot}
      <div className="max-w-[65%]">
        We sent a little bonus to your staking key.
      </div>
      <div className="flex items-center gap-6 w-max">
        <Button
          label="Learn more"
          onClick={handleLearnMoreClick}
          variant={ButtonVariant.GhostDark}
          size={ButtonSize.MD}
          labelClassesOverrides="font-semibold w-max"
        />

        <button
          className="cursor-pointer"
          title="close"
          onClick={() => removeNotificationById(id)}
        >
          <Icon source={CloseLine} className="h-5.5 w-5.5" />
        </button>
      </div>
    </div>
  );
}
