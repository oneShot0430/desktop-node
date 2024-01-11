import React, { forwardRef } from 'react';
import { twMerge } from 'tailwind-merge';

import OrcaLogo from 'assets/svgs/Orca-Logo.png';
import { Button } from 'renderer/components/ui';

type PropsType = {
  status: 'loading' | 'running' | 'paused';
  onClick?: () => void;
  isActive?: boolean;
};

export const OrcaButton = forwardRef<HTMLButtonElement, PropsType>(
  ({ onClick, isActive, ...rest }, ref) => {
    const classes = twMerge(
      'relative rounded-md hover:bg-purple-5 bg-purple-4',
      isActive && 'bg-purple-5'
    );
    return (
      <div className={classes}>
        <Button
          ref={ref}
          onlyIcon
          icon={<img src={OrcaLogo} height={60} width={60} alt="logo" />}
          className="pr-5 pl-3"
          onClick={onClick}
          {...rest}
        />
        <StatusIndicator status={rest.status} />
      </div>
    );
  }
);

OrcaButton.displayName = 'OrcaButton';

function StatusIndicator({
  status,
}: {
  status: 'loading' | 'running' | 'paused';
}) {
  if (status === 'loading') {
    return (
      <span className="absolute w-3 h-3 border border-transparent rounded-full right-2 top-3 border-t-finnieOrange border-r-finnieOrange animate-spin" />
    );
  }

  if (status === 'running') {
    return (
      <span className="absolute w-3 h-3 bg-green-300 border border-green-600 rounded-full right-2 top-3" />
    );
  }

  return (
    <span className="absolute w-3 h-3 bg-transparent border rounded-full border-finnieGray-100 right-2 top-3" />
  );
}
