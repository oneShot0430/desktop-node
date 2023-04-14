import { Icon } from '@_koii/koii-styleguide';
import React from 'react';

import HistoryIcon from 'assets/svgs/history-icon.svg';
import { Tooltip, Placement } from 'renderer/components/ui';
import { formatRoundTimeWithFullUnit, parseRoundTime } from 'renderer/utils';

type PropsType = {
  tooltipPlacement: Placement;
  roundTime: number;
};

export function RoundTime({ tooltipPlacement, roundTime }: PropsType) {
  const parsedRoundTime = parseRoundTime(roundTime);
  const fullTime = formatRoundTimeWithFullUnit(parsedRoundTime);

  return (
    <div>
      <Tooltip
        placement={tooltipPlacement}
        tooltipContent={`Round Time is ${fullTime}`}
      >
        <Icon source={HistoryIcon} />
        <div>{`${Math.ceil(parsedRoundTime.value)} ${
          parsedRoundTime.unit
        }`}</div>
      </Tooltip>
    </div>
  );
}
