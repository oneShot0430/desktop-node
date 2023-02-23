import clsx from 'clsx';
import React from 'react';

import InspectIcon from 'assets/svgs/inspect-icon.svg';

const iconSizes = {
  big: 'w-7 h-4.375',
  small: 'w-5 h-3',
};

const sizes = {
  big: 'flex-col w-9 h-9  pt-1',
  small: 'flex-row w-6 h-5 ',
};

type InspectButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  size: keyof typeof sizes;
};

function InspectButton({ size, ...props }: InspectButtonProps): JSX.Element {
  return (
    <button
      className={clsx(
        'flex items-center justify-center shadow-md rounded-finnie-small bg-neutral-100',
        sizes[size]
      )}
      {...props}
    >
      <InspectIcon className={clsx(iconSizes[size])} />
      {size === 'big' && (
        <div className="text-finnieTeal-700 text-4xs font-normal tracking-finnieSpacing-tighter mt-1">
          INSPECT
        </div>
      )}
    </button>
  );
}

export default InspectButton;
