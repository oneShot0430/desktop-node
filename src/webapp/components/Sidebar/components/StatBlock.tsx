import React, { ReactNode } from 'react';

type SummaryProps = {
  value: ReactNode;
  label: string;
  iconSlot: ReactNode;
};

export const StatBlock = ({ value, label, iconSlot }: SummaryProps) => {
  return (
    <div className="w-[186px] h-[60px] rounded bg-finnieBlue-light-secondary py-[6px] flex justify-between items-center pl-[10px] pr-[14px]">
      <div>{iconSlot}</div>
      <div className="">
        <div className="text-right text-white">{value}</div>
        <div className="text-[14px] text-finnieTeal">{label}</div>
      </div>
    </div>
  );
};
