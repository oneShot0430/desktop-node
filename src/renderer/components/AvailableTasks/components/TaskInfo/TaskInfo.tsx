import { EmbedCodeFill, Icon } from '@_koii/koii-styleguide';
import React from 'react';

import { TaskMetadata } from 'models/task';
import { NodeTools } from 'renderer/features/node-tools';

type PropsType = {
  taskPubKey: string;
  info?: TaskMetadata;
  onShowCodeClick: () => void;
  onToolsValidation?: (isValid: boolean) => void;
};

const NOT_AVAILABLE = 'N/A';

export function TaskInfo({
  taskPubKey,
  info,
  onShowCodeClick,
  onToolsValidation,
}: PropsType) {
  const handleShowSourceCode = () => {
    onShowCodeClick();
  };

  const specs = info?.requirementsTags?.filter(
    ({ type }) =>
      type === 'CPU' ||
      type === 'RAM' ||
      type === 'STORAGE' ||
      type === 'ARCHITECTURE' ||
      type === 'OS' ||
      type === 'NETWORK'
  );

  const globalSettings = info?.requirementsTags?.filter(
    ({ type }) => type === 'GLOBAL_VARIABLE'
  );

  return (
    <div className="flex flex-col w-full">
      <div className="pr-3">
        <div className="mb-3 text-base font-semibold">Task description:</div>
        <div className="flex justify-between gap-16 mb-4">
          <p>{info?.description ?? NOT_AVAILABLE}</p>
          <div
            className="w-[54px] flex flex-col items-center cursor-pointer"
            onClick={handleShowSourceCode}
          >
            <Icon source={EmbedCodeFill} size={36} color="#BEF0ED" />
            <span className="text-center">Source Code</span>
          </div>
        </div>
      </div>
      <div className="mb-6 w-fit">
        <div className="mb-2 text-base font-semibold">Node Specifications:</div>
        <div className="grid grid-flow-col grid-rows-2 gap-y-2 gap-x-12">
          {specs?.map(({ type, value }, index) => (
            <div key={index}>
              {type}: {value ?? NOT_AVAILABLE}
            </div>
          ))}
        </div>
      </div>

      {!!globalSettings?.length && (
        <>
          <div className="mb-2 text-base font-semibold">Global Tools:</div>
          <NodeTools
            taskPubKey={taskPubKey}
            tools={globalSettings}
            onToolsValidation={onToolsValidation}
          />
        </>
      )}
    </div>
  );
}
