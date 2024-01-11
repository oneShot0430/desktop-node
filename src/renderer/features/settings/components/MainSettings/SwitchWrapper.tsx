import React, { FunctionComponent } from 'react';
import { twMerge } from 'tailwind-merge';

type PropsType = {
  title: string;
  switchComponent: FunctionComponent;
  className?: string;
};

export function SwitchWrapper({
  title,
  switchComponent: SwitchComponent,
  className,
}: PropsType) {
  return (
    <div
      className={twMerge(
        'flex flex-col items-center rounded-[4px] bg-finnieTeal-100 bg-opacity-20 gap-2 p-4 px-10',
        className,
        'w-293px h-[91px]'
      )}
    >
      <span className="font-semibold">{title}</span>
      <SwitchComponent />
    </div>
  );
}
