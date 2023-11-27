import React from 'react';

import Hourglass from 'assets/svgs/HourglassIcon.svg';
import { Popover } from 'renderer/components/ui/Popover/Popover';
import { useAverageSlotTime } from 'renderer/features/common';
import { useTaskRoundTime } from 'renderer/features/tasks/hooks/useRoundTime';
import { Theme } from 'renderer/types/common';
import { formatRoundTimeWithFullUnit } from 'renderer/utils';

import { TaskItemStatCell } from '../TaskItemStatCell';

export function RoundTime({ roundTimeInMs }: { roundTimeInMs: number }) {
  const { data: averageSlotTime } = useAverageSlotTime();
  const parsedRoundTime = useTaskRoundTime({
    roundTimeInMs,
    averageSlotTime,
  });

  const fullTime =
    parsedRoundTime && formatRoundTimeWithFullUnit(parsedRoundTime);

  if (!parsedRoundTime) {
    return <span>N/A</span>;
  }

  return (
    <Popover tooltipContent={`Round Time is ${fullTime}`} theme={Theme.Dark}>
      <TaskItemStatCell
        label={<Hourglass className="w-5 h-5 xl:h-6 xl:w-6" />}
        value={
          <span>{`${Math.ceil(parsedRoundTime.value)} ${
            parsedRoundTime.unit
          }`}</span>
        }
      />
    </Popover>
  );
}
