import React from 'react';

import { TaskPairing } from 'models';
import { RequirementType, TaskMetadata } from 'models/task';
import { SourceCodeButton } from 'renderer/components/SourceCodeButton';

type PropsType = {
  info?: TaskMetadata;
  variables?: TaskPairing[];
  shouldDisplayToolsInUse?: boolean;
};

const NOT_AVAILABLE = 'N/A';

export function TaskInfo({
  info,
  variables,
  shouldDisplayToolsInUse,
}: PropsType) {
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

  return (
    <div className="flex flex-col w-full pr-3">
      <div>
        <div className="mb-3 text-base font-semibold">Task description:</div>
        <div className="flex justify-between gap-16 mb-4">
          <p>{info?.description ?? NOT_AVAILABLE}</p>

          <SourceCodeButton repositoryUrl={info?.repositoryUrl || ''} />
        </div>
      </div>
      <div className="mb-6 w-full">
        <div className="mb-2 text-base font-semibold">Node Specifications:</div>
        <div className="grid grid-flow-col grid-rows-2 gap-y-2 gap-x-12">
          {specs?.map(({ type, value }, index) => (
            <div key={index}>
              {type}: {value ?? NOT_AVAILABLE}
            </div>
          ))}
        </div>
        {shouldDisplayToolsInUse && !!variables?.length && (
          <div className="mt-6">
            <div className="mb-2 text-base font-semibold">Tools in Use:</div>
            <div className="grid grid-flow-col grid-rows-2 gap-y-2 gap-x-12">
              {variables?.map(({ name, label }) => (
                <div
                  key={name}
                  className="flex justify-between w-full my-3 items-center"
                >
                  <div className="font-semibold text-xs">{name}</div>

                  <div className="px-6 py-2 mr-6 text-sm rounded-md bg-finnieBlue-light-tertiary w-80">
                    {label}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
