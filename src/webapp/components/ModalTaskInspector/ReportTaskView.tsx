import React, { useState } from 'react';

import CloseIcon from 'svgs/close-icons/close-icon-white.svg';

import InputField from '../InputField';

type ReportTaskViewProps = {
  taskName: string;
  closeReportView: () => void;
};

export const ReportTaskView = ({
  taskName,
  closeReportView,
}: ReportTaskViewProps): JSX.Element => {
  const [reportData, setReportData] = useState({
    problematicLines: '',
    detail: '',
  });

  const handleDataChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setReportData({ ...reportData, [e.target.name]: e.target.value });
  };

  return (
    <div className="relative flex flex-col text-white pt-5 pl-9 pr-8 pb-6 transform -translate-x-1 animate-slideOut w-98.5 min-h-108.25 border-2 border-finnieRed-500 rounded-r shadow-lg bg-finnieBlue">
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
        type="input"
        name="problematicLines"
        label="Problematic lines"
        value={reportData.problematicLines}
        setValue={handleDataChange}
        className="text-sm w-full mb-7"
      />

      <InputField
        type="textArea"
        name="detail"
        label="Detailed description of the issue"
        value={reportData.detail}
        setValue={handleDataChange}
        className="text-sm w-full flex-grow"
      />

      <button className="mt-7 w-full h-8 rounded-finnie-small bg-finnieRed-500 text-finnieBlue font-semibold flex justify-center items-center">
        Report Task
      </button>
    </div>
  );
};
