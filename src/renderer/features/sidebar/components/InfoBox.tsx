import React from 'react';
import { twMerge } from 'tailwind-merge';

type PropsType = {
  children: React.ReactNode;
  className?: string;
};

export function InfoBox({ children, className }: PropsType) {
  const classNames = twMerge(
    'flex flex-col text-white w-[186px] xl:w-[230px] rounded bg-finnieBlue-light-secondary p-2',
    className || ''
  );

  return <div className={classNames}>{children}</div>;
}
