import React from 'react';

import UpdateIcon from 'assets/svgs/update-icon.svg';

export function UpgradeInProgressContent() {
  return (
    <>
      <UpdateIcon className="text-finnieTeal-100" />
      <div className="col-span-4 text-left mr-auto">Upgrade in process!</div>
    </>
  );
}
