import React from 'react';

type PropsType = {
  title: string;
  switchComponentSlot: React.ReactNode;
};

export function SwitchWrapper({ title, switchComponentSlot }: PropsType) {
  return (
    <div className="flex flex-col items-center rounded-md bg-finnieTeal-100 bg-opacity-20 gap-2 p-4 px-10 w-[276px]">
      <span className="font-semibold">{title}</span>
      <div>{switchComponentSlot}</div>
    </div>
  );
}
