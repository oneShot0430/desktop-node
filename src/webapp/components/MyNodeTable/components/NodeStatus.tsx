import React from 'react';

import StatusAcceptingSubmissionIcon from 'assets/svgs/status-accepting-icon.svg';
import StatusCompletedIcon from 'assets/svgs/status-completed-icon.svg';
import StatusVotingIcon from 'assets/svgs/status-voting-icon.svg';
import { TaskStatus } from 'webapp/@type/task';

type PropsType = {
  status: TaskStatus;
};

export const NodeStatus = ({ status }: PropsType) => {
  const statusComponent = {
    [TaskStatus.ACCEPTING_SUBMISSIONS]: (
      <div>
        <StatusAcceptingSubmissionIcon />
      </div>
    ),
    [TaskStatus.COMPLETED]: (
      <div>
        <StatusCompletedIcon />
      </div>
    ),
    [TaskStatus.VOTING]: (
      <div>
        <StatusVotingIcon />
      </div>
    ),
  }[status];

  return statusComponent ?? null;
};
