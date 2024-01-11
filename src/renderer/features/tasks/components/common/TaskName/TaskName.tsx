import React from 'react';
import { twMerge } from 'tailwind-merge';

import { OrcaTag } from '../../OrcaTag';

export function TaskName({
  taskName,
  className,
  isUsingOrca,
}: {
  taskName: string;
  className?: string;
  isUsingOrca?: boolean;
}) {
  const wrapperClasses = twMerge(
    'flex flex-col text-sm xl:text-base font-semibold justify-self-start max-w-[140px]',
    className
  );
  return (
    <div className={wrapperClasses}>
      <div className="overflow-hidden truncate whitespace-nowrap">
        {taskName}
        {isUsingOrca && <OrcaTag />}
      </div>
    </div>
  );
}
