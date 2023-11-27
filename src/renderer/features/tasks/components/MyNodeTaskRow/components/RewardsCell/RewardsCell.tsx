import React from 'react';

type PropsType = {
  pendingRewards: React.ReactNode;
  allTimeRewards: React.ReactNode;
};

export function RewardsCell({ pendingRewards, allTimeRewards }: PropsType) {
  return (
    <div className="flex justify-between bg-finnieBlue-light-transparent w-[162px] h-[50px] xl:w-[182px] rounded-lg p-2 px-4">
      <div>
        <div className="text-[10px] xl:text-xs">Pending</div>
        <div className="text-[12px] xl:text-md">{pendingRewards}</div>
      </div>
      <div>
        <div className="text-[10px] xl:text-xs">All time</div>
        <div className="text-[12px] xl:text-md">{allTimeRewards}</div>
      </div>
    </div>
  );
}
