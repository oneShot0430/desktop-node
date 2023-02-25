import { EmbedCodeFill, Icon } from '@_koii/koii-styleguide';
import React from 'react';

import { Task } from 'renderer/types';

type PropsType = {
  task: Task;
  onShowCodeClick: () => void;
};

const NOT_AVAILABLE = 'N/A';

export function TaskInfo({ task, onShowCodeClick }: PropsType) {
  const handleShowSourceCode = () => {
    onShowCodeClick();
  };

  return (
    <div className="flex flex-col w-full">
      <div className="pr-3">
        <div className="mb-3 text-base font-semibold">Task description:</div>
        <div className="flex justify-between gap-16 mb-4">
          <p>{task?.metadata?.description ?? NOT_AVAILABLE}</p>
          <div
            className="w-[54px] flex flex-col items-center cursor-pointer"
            onClick={handleShowSourceCode}
          >
            <Icon source={EmbedCodeFill} size={36} color="#BEF0ED" />
            <span className="text-center">Source Code</span>
          </div>
        </div>
      </div>
      {/**
       * @dev
       * This will be unhidden when metadata is available
       */}
      <div className="mb-6 w-fit">
        <div className="mb-2 text-base font-semibold">Node Specifications:</div>
        <div className="grid grid-flow-col grid-rows-2 gap-y-2 gap-x-12">
          <div className="">
            Storage: {task?.metadata?.nodeSpec?.storage ?? NOT_AVAILABLE}
          </div>
          <div>Other: {task?.metadata?.nodeSpec?.other ?? NOT_AVAILABLE}</div>
          <div>Ram: {task?.metadata?.nodeSpec?.memory ?? NOT_AVAILABLE}</div>
          <div>OS: {task?.metadata?.nodeSpec?.os ?? NOT_AVAILABLE}</div>
        </div>
      </div>
    </div>
  );
}
