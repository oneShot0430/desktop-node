import clsx from 'clsx';
import { noop } from 'lodash';
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
  isRunning: boolean;
  taskAccountPubKey: string;
  onStateChange?: () => void;
};

const RunButton = ({
  isRunning,
  taskAccountPubKey,
  onStateChange = noop,
}: RunButtonProps): JSX.Element => {
  const changeState = () => {
    window.main[isRunning ? 'stopTask' : 'startTask']({
      taskAccountPubKey,
    }).finally(onStateChange);
  };

  return (
    <div
      className={clsx(
        'flex items-center justify-center rounded-full w-8 h-8 filter drop-shadow cursor-pointer',
        variants[isRunning ? 'play-active' : 'pause-active']
      )}
      onClick={changeState}
    >
      {logos[isRunning ? 'play-active' : 'pause-active']}
    </div>
  );
};

export default RunButton;
