import React from 'react';

import UpdateIcon from 'assets/svgs/update-icon.svg';
import { LoadingSpinner } from 'renderer/components';

export function UpgradeInProgressContent() {
  return (
    <>
      <UpdateIcon className="text-finnieTeal-100" />
      <div className="flex col-span-4 text-left mr-auto">
        Upgrade in process! It might take a few minutes.
        <LoadingSpinner className="ml-6" />
      </div>
    </>
  );
}
