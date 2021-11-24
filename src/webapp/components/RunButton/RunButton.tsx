import clsx from 'clsx';
import React from 'react';

import PauseActiveIcon from 'svgs/run-button-icons/pause-active-icon.svg';
import PlayActiveIcon from 'svgs/run-button-icons/play-active-icon.svg';
import PlayDeactivatedIcon from 'svgs/run-button-icons/play-deactivated-icon.svg';

const variants = {
  'play-active': 'bg-finnieEmerald pl-1',
  'play-deactivated': 'bg-finnieBlue opacity-60 pl-1',
  'pause-active': 'bg-finnieTeal-100',
};

const logos = {
  'play-active': <PlayActiveIcon />,
  'play-deactivated': <PlayDeactivatedIcon />,
  'pause-active': <PauseActiveIcon />,
};

type RunButtonProps = {
  variant: keyof typeof variants;
};

const RunButton = ({ variant }: RunButtonProps): JSX.Element => {
  return (
    <div
      className={clsx(
        'flex items-center justify-center rounded-full w-8 h-8 filter drop-shadow cursor-pointer',
        variants[variant]
      )}
    >
      {logos[variant]}
    </div>
  );
};

export default RunButton;
