import React from 'react';

import { RequirementType, TaskMetadata } from 'models/task';
import { SourceCodeButton } from 'renderer/components/SourceCodeButton';

type PropsType = {
  info?: TaskMetadata;
};

const NOT_AVAILABLE = 'N/A';

export function TaskInfo({ info }: PropsType) {
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
    </div>
  );
}
