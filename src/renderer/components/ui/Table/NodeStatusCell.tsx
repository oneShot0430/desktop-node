import {
  WaitingPendingLine,
  ProgressLine,
  CheckSuccessLine,
  Icon,
} from '@_koii/koii-styleguide';
import React from 'react';

import { Tooltip, Placement } from 'renderer/components/ui/Tooltip';
import { TaskStatus } from 'renderer/types';

const statuses = {
  [TaskStatus.ACCEPTING_SUBMISSIONS]: {
    icon: WaitingPendingLine,
    iconColor: 'text-finnieRed',
    title: 'Accepting Submissions',
  },
  [TaskStatus.COMPLETED]: {
    icon: CheckSuccessLine,
    iconColor: 'text-finnieTeal-100',
    title: 'Completed',
  },
  [TaskStatus.VOTING]: {
    icon: ProgressLine,
    iconColor: 'text-finnieOrange',
    title: 'Voting',
  },
};

type PropsType = {
  status: TaskStatus;
  isFirstRowInTable?: boolean;
};

export const NodeStatusCell = ({ status, isFirstRowInTable }: PropsType) => {
  const { icon: StatusIcon, title, iconColor } = statuses[status];
  const tooltipPlacement: Placement = `${
    isFirstRowInTable ? 'bottom' : 'top'
  }-left`;

  return (
    <Tooltip tooltipContent={`Status: ${title}`} placement={tooltipPlacement}>
      <Icon source={StatusIcon} className={`h-8 w-8 mb-2 ${iconColor}`} />
    </Tooltip>
  );
};
