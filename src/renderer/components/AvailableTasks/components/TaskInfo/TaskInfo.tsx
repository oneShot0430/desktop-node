import { EmbedCodeFill, Icon } from '@_koii/koii-styleguide';
import React, { useEffect } from 'react';

import { RequirementType, TaskMetadata } from 'models/task';
import { Tooltip } from 'renderer/components/ui';
import { NodeTools } from 'renderer/features/node-tools';
import { openBrowserWindow } from 'renderer/services';

type PropsType = {
  taskPubKey: string;
  info?: TaskMetadata;
  onToolsValidation?: (isValid: boolean) => void;
};

const NOT_AVAILABLE = 'N/A';

export function TaskInfo({ taskPubKey, info, onToolsValidation }: PropsType) {
  const showSourceCodeInRepository = () => {
    const repositoryUrl = info?.repositoryUrl ?? '';
    const fullUrl = repositoryUrl.includes('http')
      ? repositoryUrl
      : `https://${repositoryUrl}`;

    openBrowserWindow(fullUrl);
  };

  const specs = info?.requirementsTags?.filter(({ type }) =>
    [
      RequirementType.CPU,
      RequirementType.RAM,
      RequirementType.STORAGE,
      RequirementType.ARCHITECTURE,
      RequirementType.OS,
      RequirementType.NETWORK,
    ].includes(type)
  );

  const globalSettings = info?.requirementsTags?.filter(
    ({ type }) => type === RequirementType.GLOBAL_VARIABLE
  );

  useEffect(() => {
    if (!globalSettings?.length) {
      onToolsValidation?.(true);
    }
  });

  return (
    <div className="flex flex-col w-full">
      <div className="pr-3">
        <div className="mb-3 text-base font-semibold">Task description:</div>
        <div className="flex justify-between gap-16 mb-4">
          <p>{info?.description ?? NOT_AVAILABLE}</p>

          <button
            className={`w-[54px] h-[76px] flex flex-col items-center ${
              info?.repositoryUrl ? 'cursor-pointer' : 'cursor-not-allowed'
            }`}
            onClick={showSourceCodeInRepository}
            disabled={!info?.repositoryUrl}
          >
            {info?.repositoryUrl ? (
              <>
                <Icon source={EmbedCodeFill} size={36} color="#BEF0ED" />
                <span className="text-center">Source Code</span>
              </>
            ) : (
              <Tooltip
                tooltipContent="Repository URL is missing or invalid"
                placement="top-left"
              >
                <Icon source={EmbedCodeFill} size={36} color="#BEF0ED" />
                <span className="text-center">Source Code</span>
              </Tooltip>
            )}
          </button>
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
