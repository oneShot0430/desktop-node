import React from 'react';

import StatusAcceptingSubmissionIcon from 'assets/svgs/status-accepting-icon.svg';
import StatusCompletedIcon from 'assets/svgs/status-completed-icon.svg';
import StatusVotingIcon from 'assets/svgs/status-voting-icon.svg';
import { Tooltip } from 'webapp/components';
import { Placement } from 'webapp/components/ui/Tooltip';
import { TaskStatus } from 'webapp/types';

const statuses = {
  [TaskStatus.ACCEPTING_SUBMISSIONS]: {
    component: StatusAcceptingSubmissionIcon,
    title: 'Accepting Submissions',
  },
  [TaskStatus.COMPLETED]: {
    component: StatusCompletedIcon,
    title: 'Completed',
  },
  [TaskStatus.VOTING]: {
    component: StatusVotingIcon,
    title: 'Voting',
  },
};

type PropsType = {
  status: TaskStatus;
  isFirstRowInTable?: boolean;
};

export const NodeStatusCell = ({ status, isFirstRowInTable }: PropsType) => {
  const { component: StatusComponent, title } = statuses[status];
  const tooltipPlacement: Placement = `${
    isFirstRowInTable ? 'bottom' : 'top'
  }-left`;

  return (
    <Tooltip tooltipContent={`Status: ${title}`} placement={tooltipPlacement}>
      <StatusComponent />
    </Tooltip>
  );
};
