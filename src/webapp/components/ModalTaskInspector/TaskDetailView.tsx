import React from 'react';
import { useQuery } from 'react-query';

import ReportTaskIcon from 'svgs/flag-icon.svg';
import { Task } from 'webapp/@type/task';
import {
  getRewardEarned,
  QueryKeys,
  TaskService,
  TaskStatusToLabeMap,
} from 'webapp/services';

type TaskDetailViewProps = {
  task: Task;
  showWithdraw: () => void;
  openReportView: () => void;
};

const TaskDetailView = ({
  task,
  showWithdraw,
  openReportView,
}: TaskDetailViewProps): JSX.Element => {
  const { data: rewardEarned } = useQuery(
    [QueryKeys.taskReward, task.publicKey],
    () => getRewardEarned(task)
  );

  const totalStake = TaskService.getTotalStaked(task);
  const nodes = TaskService.getNodesCount(task);
  const topStake = TaskService.getTopStake(task);
  const state = TaskStatusToLabeMap[TaskService.getStatus(task)];

  const { data: myStake } = useQuery([QueryKeys.myStake, task.publicKey], () =>
    TaskService.getMyStake(task)
  );

  return (
    <>
      <div className="relative flex font-semibold mb-5.5">
        <ReportTaskIcon
          onClick={openReportView}
          className="absolute top-1 -left-6.25 w-2.5 h-3.5 cursor-pointer"
        />
        <div className="text-finnieEmerald">{task.taskName}&nbsp;</div>
        <div className="text-white">Details</div>
      </div>
      <div className="flex mb-1 text-sm">
        <div className="text-white w-59.25 flex items-start leading-6">
          Owner:
        </div>
        <div className="font-semibold text-finnieTeal">{task.taskManager}</div>
      </div>

      <div className="flex mb-1 text-sm">
        <div className="text-white w-59.25 flex items-start leading-6">
          Total KOII bounty:
        </div>
        <div className="font-semibold text-finnieTeal">
          {task.bountyAmountPerRound}
        </div>
      </div>

      <div className="flex mb-1 text-sm">
        <div className="text-white w-59.25 flex items-start leading-6">
          Nodes participating:
        </div>
        <div className="font-semibold text-finnieTeal">{nodes}</div>
      </div>

      {/** This field is mocked */}
      <div className="flex mb-1 text-sm">
        <div className="text-white w-59.25 flex items-start leading-6">
          Total KOII staked:
        </div>
        <div className="font-semibold text-finnieTeal">{totalStake}</div>
      </div>

      <div className="flex mb-1 text-sm">
        <div className="text-white w-59.25 flex items-start leading-6">
          Current top stake:
        </div>
        <div className="font-semibold text-finnieTeal">{topStake}</div>
      </div>

      <div className="flex mb-1 text-sm">
        <div className="text-white w-59.25 flex items-start leading-6">
          My KOII staked:
        </div>
        <div className="font-semibold text-finnieTeal">{myStake}</div>
      </div>

      <div className="flex mb-1 text-sm">
        <div className="text-white w-59.25 flex items-start leading-6">
          State:
        </div>
        <div className="font-semibold text-finnieTeal">{state}</div>
      </div>

      <div className="flex text-sm">
        <div className="text-white w-59.25 flex items-start leading-6">
          My Rewards:
        </div>
        <div className="font-semibold text-finnieTeal">{rewardEarned}</div>
      </div>

      <button
        className="bg-white w-44.75 h-8 rounded-finnie-small shadow-lg text-base font-semibold mt-auto"
        onClick={showWithdraw}
      >
        Withdraw Stake
      </button>
    </>
  );
};

export default TaskDetailView;
