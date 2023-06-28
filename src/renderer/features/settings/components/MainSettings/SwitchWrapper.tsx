import React, { FunctionComponent } from 'react';

type PropsType = {
  title: string;
  switchComponent: FunctionComponent;
};

export function SwitchWrapper({
  title,
  switchComponent: SwitchComponent,
}: PropsType) {
  return (
    <div className="flex flex-col items-center rounded-md bg-finnieTeal-100 bg-opacity-20 gap-2 p-4 px-10 w-[293px]">
      <span className="font-semibold">{title}</span>
      <SwitchComponent />
    </div>
  );
}
