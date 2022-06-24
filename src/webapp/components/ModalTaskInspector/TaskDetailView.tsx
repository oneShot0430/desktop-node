import React, { useEffect, useState } from 'react';

import ReportTaskIcon from 'svgs/flag-icon.svg';
import { Task } from 'webapp/@type/task';
import { TaskService, TaskStatusToLabeMap } from 'webapp/services/taskService';

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
  const [rewardEarned, setRewardEarned] = useState(0);

  useEffect(() => {
    window.main
      .getEarnedRewardByNode({
        taskAccountPubKey: task.publicKey,
        available_balances: task.availableBalances,
      })
      .then((rewardEarned) => setRewardEarned(rewardEarned));
  }, []);

  const stake = TaskService.getMyStake(task);
  const totalStake = TaskService.getTotalStaked(task);
  const nodes = TaskService.getNodesCount(task);
  const topStake = TaskService.getTopStake(task);
  const state = TaskStatusToLabeMap[TaskService.getStatus(task)];

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
      <div className="flex text-sm mb-1">
        <div className="text-white w-59.25 flex items-start leading-6">
          Owner:
        </div>
        <div className="text-finnieTeal font-semibold">{task.taskManager}</div>
      </div>

      <div className="flex text-sm mb-1">
        <div className="text-white w-59.25 flex items-start leading-6">
          Total KOII bounty:
        </div>
        <div className="text-finnieTeal font-semibold">
          {task.bountyAmountPerRound}
        </div>
      </div>

      <div className="flex text-sm mb-1">
        <div className="text-white w-59.25 flex items-start leading-6">
          Nodes participating:
        </div>
        <div className="text-finnieTeal font-semibold">{nodes}</div>
      </div>

      {/** This field is mocked */}
      <div className="flex text-sm mb-1">
        <div className="text-white w-59.25 flex items-start leading-6">
          Total KOII staked:
        </div>
        <div className="text-finnieTeal font-semibold">{totalStake}</div>
      </div>

      <div className="flex text-sm mb-1">
        <div className="text-white w-59.25 flex items-start leading-6">
          Current top stake:
        </div>
        <div className="text-finnieTeal font-semibold">{topStake}</div>
      </div>

      <div className="flex text-sm mb-1">
        <div className="text-white w-59.25 flex items-start leading-6">
          My KOII staked:
        </div>
        <div className="text-finnieTeal font-semibold">{stake}</div>
      </div>

      <div className="flex text-sm mb-1">
        <div className="text-white w-59.25 flex items-start leading-6">
          State:
        </div>
        <div className="text-finnieTeal font-semibold">{state}</div>
      </div>

      <div className="flex text-sm">
        <div className="text-white w-59.25 flex items-start leading-6">
          My Rewards:
        </div>
        <div className="text-finnieTeal font-semibold">{rewardEarned}</div>
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
