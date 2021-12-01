import clsx from 'clsx';
import React, { useState } from 'react';

import CloseIcon from 'svgs/close-icons/close-icon-white.svg';

import InputField from '../InputField';

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
  const [problemLine, setProblemLine] = useState('');

  return (
    <div className={clsx(className, 'relative text-white pt-5 pl-9 pr-8')}>
      <CloseIcon
        onClick={closeReportView}
        className="w-6 h-6 absolute top-2 right-2 cursor-pointer"
      />
      <div className="flex font-semibold mb-5.25">
        <div className="text-white">Report</div>
        <div className="text-finnieEmerald">&nbsp;{taskName}</div>
      </div>

      <div className="text-sm leading-6 mb-3">
        <p>What is the issue?</p>
        <p>Please leave as much detail as you can.</p>
      </div>

      <InputField
        label="Problematic lines"
        value={problemLine}
        setValue={(e) => setProblemLine(e.target.value)}
        className="text-sm w-full"
      />
    </div>
  );
};
