import React from 'react';

import CheckMarkTealIcon from 'assets/svgs/checkmark-teal-icon.svg';

interface UpgradeSucceededContentProps {
  newTaskVersionName: string;
}

export function UpgradeSucceededContent({
  newTaskVersionName,
}: UpgradeSucceededContentProps) {
  return (
    <>
      <CheckMarkTealIcon className="w-12 h-12" />{' '}
      <div className="col-span-4 text-left mr-auto">
        All set!{' '}
        <span className="text-finnieEmerald-light">{newTaskVersionName}</span>{' '}
        is running smoothly.
      </div>
    </>
  );
}
