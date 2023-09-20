import { Icon } from '@_koii/koii-styleguide';
import React, { useEffect, useState } from 'react';

import HourGlassIcon from 'assets/svgs/hour-glass-icon.svg';
import { Tooltip, Placement } from 'renderer/components/ui';
import { getAverageSlotTime } from 'renderer/services';
import {
  formatRoundTimeWithFullUnit,
  parseRoundTime,
  ParsedRoundTime,
} from 'renderer/utils';

type PropsType = {
  tooltipPlacement: Placement;
  roundTime: number;
};

export function RoundTime({ tooltipPlacement, roundTime }: PropsType) {
  const [parsedRoundTime, setParsedRoundTime] = useState<ParsedRoundTime>({
    value: 0,
    unit: 's',
  });

  useEffect(() => {
    const getParsedRoundTime = async () => {
      const averageSlotTime = await getAverageSlotTime();
      const parsedRoundTime = parseRoundTime(roundTime * averageSlotTime);
      setParsedRoundTime(parsedRoundTime);
    };
    getParsedRoundTime();
  }, [roundTime]);

  const fullTime = formatRoundTimeWithFullUnit(parsedRoundTime);

  return (
    <div>
      <Tooltip
        placement={tooltipPlacement}
        tooltipContent={`Round Time is ${fullTime}`}
      >
        <Icon source={HourGlassIcon} />
        <div>{`${Math.ceil(parsedRoundTime.value)} ${
          parsedRoundTime.unit
        }`}</div>
      </Tooltip>
    </div>
  );
}
