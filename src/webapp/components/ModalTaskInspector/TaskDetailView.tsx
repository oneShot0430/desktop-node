import React from 'react';

import ReportTaskIcon from 'svgs/flag-icon.svg';

type Task = {
  name: string;
  owner: string;
  totalKOIIBounty: number;
  nodesParticipating: number;
  totalKOIIStaked: number;
  currentTopStake: number;
  myKOIIStaked: number;
  state: string;
  myRewards: number;
};
type TaskDetailViewProps = {
  taskInfo: Partial<Task>;
  showWidthdraw: () => void;
};

const TaskDetailView = ({
  taskInfo,
  showWidthdraw,
}: TaskDetailViewProps): JSX.Element => {
  return (
    <>
      <div className="relative flex font-semibold mb-5.5">
        <ReportTaskIcon className="absolute top-1 -left-6.25 w-2.5 h-3.5" />
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
        <div className="text-finnieTeal font-semibold">
          {taskInfo.totalKOIIBounty}
        </div>
      </div>

      <div className="flex text-sm mb-1">
        <div className="text-white w-59.25 flex items-start leading-6">
          Nodes participating:
        </div>
        <div className="text-finnieTeal font-semibold">
          {taskInfo.nodesParticipating}
        </div>
      </div>

      <div className="flex text-sm mb-1">
        <div className="text-white w-59.25 flex items-start leading-6">
          Total KOII staked:
        </div>
        <div className="text-finnieTeal font-semibold">
          {taskInfo.totalKOIIStaked}
        </div>
      </div>

      <div className="flex text-sm mb-1">
        <div className="text-white w-59.25 flex items-start leading-6">
          Current top stake:
        </div>
        <div className="text-finnieTeal font-semibold">
          {taskInfo.currentTopStake}
        </div>
      </div>

      <div className="flex text-sm mb-1">
        <div className="text-white w-59.25 flex items-start leading-6">
          My KOII staked:
        </div>
        <div className="text-finnieTeal font-semibold">
          {taskInfo.myKOIIStaked}
        </div>
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
          {taskInfo.myRewards}
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
