import React from 'react';
import { twMerge } from 'tailwind-merge';

export function TaskName({
  taskName,
  className,
}: {
  taskName: string;
  className?: string;
}) {
  const wrapperClasses = twMerge(
    'flex flex-col text-sm xl:text-base font-semibold justify-self-start max-w-[140px]',
    className
  );
  return (
    <div className={wrapperClasses}>
      <div className="overflow-hidden truncate whitespace-nowrap">
        {taskName}
      </div>
    </div>
  );
}
