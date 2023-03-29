import React, { useEffect } from 'react';

import { RequirementType, TaskMetadata } from 'models/task';
import { SourceCodeButton } from 'renderer/components/SourceCodeButton';
import { NodeTools } from 'renderer/features/node-tools';

type PropsType = {
  taskPubKey: string;
  info?: TaskMetadata;
  onToolsValidation?: (isValid: boolean) => void;
};

const NOT_AVAILABLE = 'N/A';

export function TaskInfo({ taskPubKey, info, onToolsValidation }: PropsType) {
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

          <SourceCodeButton
            repositoryUrl={info?.repositoryUrl || ''}
            iconSize={36}
            displayLabel
          />
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

      {/* {!!globalSettings?.length && ( */}
      {/*  <> */}
      {/*    <div className="mb-2 text-base font-semibold">Global Tools:</div> */}
      {/*    <NodeTools */}
      {/*      taskPubKey={taskPubKey} */}
      {/*      tools={globalSettings} */}
      {/*      onToolsValidation={onToolsValidation} */}
      {/*    /> */}
      {/*  </> */}
      {/* )} */}
    </div>
  );
}
