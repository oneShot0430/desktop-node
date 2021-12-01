import React from 'react';

import ReportTaskIcon from 'svgs/flag-icon.svg';
import { Task } from 'webapp/@type/task';

type TaskDetailViewProps = {
  taskInfo: Partial<Task>;
  showWidthdraw: () => void;
  openReportView: () => void;
};

const TaskDetailView = ({
  taskInfo,
  showWidthdraw,
  openReportView,
}: TaskDetailViewProps): JSX.Element => {
  return (
    <>
      <div className="relative flex font-semibold mb-5.5">
        <ReportTaskIcon
          onClick={openReportView}
          className="absolute top-1 -left-6.25 w-2.5 h-3.5 cursor-pointer"
        />
        <div className="text-finnieEmerald">{taskInfo.name}&nbsp;</div>
        <div className="text-white">Details</div>
      </div>
      <div className="flex text-sm mb-1">
        <div className="text-white w-59.25 flex items-start leading-6">
          Owner:
        </div>
        <div className="text-finnieTeal font-semibold">{taskInfo.owner}</div>
      </div>

      <div className="flex text-sm mb-1">
        <div className="text-white w-59.25 flex items-start leading-6">
          Total KOII bounty:
        </div>
        <div className="text-finnieTeal font-semibold">{taskInfo.bounty}</div>
      </div>

      <div className="flex text-sm mb-1">
        <div className="text-white w-59.25 flex items-start leading-6">
          Nodes participating:
        </div>
        <div className="text-finnieTeal font-semibold">{taskInfo.nodes}</div>
      </div>

      {/** This field is mocked */}
      <div className="flex text-sm mb-1">
        <div className="text-white w-59.25 flex items-start leading-6">
          Total KOII staked:
        </div>
        <div className="text-finnieTeal font-semibold">{taskInfo.topStake}</div>
      </div>

      <div className="flex text-sm mb-1">
        <div className="text-white w-59.25 flex items-start leading-6">
          Current top stake:
        </div>
        <div className="text-finnieTeal font-semibold">{taskInfo.topStake}</div>
      </div>

      <div className="flex text-sm mb-1">
        <div className="text-white w-59.25 flex items-start leading-6">
          My KOII staked:
        </div>
        <div className="text-finnieTeal font-semibold">{taskInfo.stake}</div>
      </div>

      <div className="flex text-sm mb-1">
        <div className="text-white w-59.25 flex items-start leading-6">
          State:
        </div>
        <div className="text-finnieTeal font-semibold">{taskInfo.state}</div>
      </div>

      <div className="flex text-sm mb-13">
        <div className="text-white w-59.25 flex items-start leading-6">
          My Rewards:
        </div>
        <div className="text-finnieTeal font-semibold">
          {taskInfo.rewardEarned}
        </div>
      </div>

      <button
        className="bg-white w-44.75 h-8 rounded-finnie-small shadow-lg text-base font-semibold"
        onClick={showWidthdraw}
      >
        Withdraw Stake
      </button>
    </>
  );
};

export default TaskDetailView;
