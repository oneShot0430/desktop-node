import {
  WaitingPendingLine,
  ProgressLine,
  CheckSuccessLine,
  CloseLine,
  WarningTriangleLine,
  FlagReportLine,
  Icon,
} from '@_koii/koii-styleguide';
import React from 'react';

import CoolDown from 'assets/svgs/cooldown-line.svg';
import WarmUp from 'assets/svgs/warmup-line.svg';
import { TaskStatus } from 'renderer/types';

import { LoadingSpinner } from '../LoadingSpinner';
import { Tooltip, Placement } from '../Tooltip';

const statuses = {
  [TaskStatus.PRE_SUBMISSION]: {
    icon: WaitingPendingLine,
    iconColor: 'text-white',
    tooltip: 'Awaiting node’s first submission.',
  },
  [TaskStatus.WARMING_UP]: {
    icon: WarmUp,
    iconColor: 'text-finnieOrange',
    tooltip: 'Warming up: You can start earning rewards after 3 rounds.',
  },
  [TaskStatus.ACTIVE]: {
    icon: ProgressLine,
    iconColor: 'text-finnieEmerald-light',
    tooltip: 'Task in progress.',
  },
  [TaskStatus.COOLING_DOWN]: {
    icon: CoolDown,
    iconColor: 'text-finnieTeal-100',
    tooltip: 'Cooling down: Wait 3 rounds to safely unstake.',
  },
  [TaskStatus.COMPLETE]: {
    icon: CheckSuccessLine,
    iconColor: 'text-finnieEmerald-light',
    tooltip: 'Task complete.',
  },
  [TaskStatus.STOPPED]: {
    icon: CloseLine,
    iconColor: 'text-white',
    tooltip: 'Stopped.',
  },
  [TaskStatus.ERROR]: {
    icon: WarningTriangleLine,
    iconColor: 'text-[#FFA54B]',
    tooltip: "Something's wrong. Try running this task again.",
  },
  [TaskStatus.FLAGGED]: {
    icon: FlagReportLine,
    iconColor: 'text-finnieRed',
    tooltip: 'Your node has been flagged as malicious.',
  },
};

type PropsType = {
  status: TaskStatus;
  isFirstRowInTable?: boolean;
  isLoading?: boolean;
};

export function Status({ status, isFirstRowInTable, isLoading }: PropsType) {
  const { icon: StatusIcon, tooltip, iconColor } = statuses[status];
  const tooltipPlacement: Placement = `${
    isFirstRowInTable ? 'bottom' : 'top'
  }-left`;

  return isLoading ? (
    <LoadingSpinner />
  ) : (
    <Tooltip tooltipContent={tooltip} placement={tooltipPlacement}>
      <Icon source={StatusIcon} className={`h-8 w-8 ${iconColor}`} />
    </Tooltip>
  );
}
