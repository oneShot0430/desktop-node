import React, { ReactNode } from 'react';

import { LoadingSpinner } from 'webapp/components/ui';

type SummaryProps = {
  value: number;
  label: string;
  iconSlot: ReactNode;
  isLoading: boolean;
};

export const StatBlock = ({
  value,
  label,
  iconSlot,
  isLoading,
}: SummaryProps) => {
  const statValue = isLoading ? <LoadingSpinner className="ml-auto" /> : value;

  return (
    <div className="w-[186px] h-[60px] rounded bg-finnieBlue-light-secondary py-[6px] flex justify-between items-center pl-[10px] pr-[14px]">
      <div>{iconSlot}</div>
      <div className="">
        <div className="text-right text-white">{statValue}</div>
        <div className="text-[14px] text-finnieTeal">{label}</div>
      </div>
    </div>
  );
};
