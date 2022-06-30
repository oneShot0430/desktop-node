import React from 'react';

import StatusAcceptingSubmissionIcon from 'assets/svgs/status-accepting-icon.svg';
import StatusCompletedIcon from 'assets/svgs/status-completed-icon.svg';
import StatusVotingIcon from 'assets/svgs/status-voting-icon.svg';
import { TaskStatus } from 'webapp/@type/task';

import { TableCell } from './TableCell';

type PropsType = {
  status: TaskStatus;
};

export const NodeStatusCell = ({ status }: PropsType) => {
  const statusComponent = {
    [TaskStatus.ACCEPTING_SUBMISSIONS]: <StatusAcceptingSubmissionIcon />,
    [TaskStatus.COMPLETED]: <StatusCompletedIcon />,
    [TaskStatus.VOTING]: <StatusVotingIcon />,
  }[status];

  return <TableCell>{statusComponent ?? null}</TableCell>;
};
