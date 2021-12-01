import clsx from 'clsx';
import React from 'react';

import CloseIcon from 'svgs/close-icons/close-icon-white.svg';

type ReportTaskViewProps = {
  className: string;
  taskName: string;
  closeReportView: () => void;
};

export const ReportTaskView = ({
  className,
  taskName,
  closeReportView,
}: ReportTaskViewProps): JSX.Element => {
  return (
    <div className={clsx(className, 'relative text-white pt-5 pl-9')}>
      <CloseIcon
        onClick={closeReportView}
        className="w-6 h-6 absolute top-2 right-2 cursor-pointer"
      />
      <div className="flex font-semibold">
        <div className="text-white">Report</div>
        <div className="text-finnieEmerald">&nbsp;{taskName}</div>
      </div>
    </div>
  );
};
