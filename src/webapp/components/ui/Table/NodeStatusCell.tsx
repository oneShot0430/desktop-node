import React from 'react';

import StatusAcceptingSubmissionIcon from 'assets/svgs/status-accepting-icon.svg';
import StatusCompletedIcon from 'assets/svgs/status-completed-icon.svg';
import StatusVotingIcon from 'assets/svgs/status-voting-icon.svg';
import { Tooltip } from 'webapp/components';
import { TaskStatus } from 'webapp/types';

import { TableCell } from './TableCell';

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
};

export const NodeStatusCell = ({ status }: PropsType) => {
  const { component: StatusComponent, title } = statuses[status];

  return (
    <TableCell>
      <Tooltip tooltipContent={`Status: ${title}`}>
        <StatusComponent />
      </Tooltip>
    </TableCell>
  );
};
