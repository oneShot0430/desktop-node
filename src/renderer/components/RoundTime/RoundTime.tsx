import { Icon } from '@_koii/koii-styleguide';
import React, { useEffect, useState } from 'react';

import HistoryIcon from 'assets/svgs/history-icon.svg';
import { Tooltip, Placement } from 'renderer/components/ui';
import { getAverageSlotTime } from 'renderer/services';
import { formatRoundTimeWithFullUnit, parseRoundTime } from 'renderer/utils';

type PropsType = {
  tooltipPlacement: Placement;
  roundTime: number;
};

type ParsedRoundTimeType = {
  unit: 'd' | 'h' | 'm' | 's';
  value: number;
};

export function RoundTime({ tooltipPlacement, roundTime }: PropsType) {
  const [parsedRoundTime, setParsedRoundTime] = useState<ParsedRoundTimeType>({
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
        <Icon source={HistoryIcon} />
        <div>{`${Math.ceil(parsedRoundTime.value)} ${
          parsedRoundTime.unit
        }`}</div>
      </Tooltip>
    </div>
  );
}
