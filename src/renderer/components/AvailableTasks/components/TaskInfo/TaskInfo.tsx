import React from 'react';

import { TaskPairing } from 'models';
import { RequirementType, TaskMetadata } from 'models/task';
import { SourceCodeButton } from 'renderer/components/SourceCodeButton';

type PropsType = {
  publicKey: string;
  metadata?: TaskMetadata;
  details: {
    nodes: number;
    minStake: number;
    topStake: number;
    bounty: number;
  };
  variables?: TaskPairing[];
  shouldDisplayToolsInUse?: boolean;
};

const NOT_AVAILABLE = 'N/A';

export function TaskInfo({
  publicKey,
  metadata,
  details: { nodes, minStake, topStake, bounty },
  variables,
  shouldDisplayToolsInUse,
}: PropsType) {
  const specs = metadata?.requirementsTags?.filter(({ type }) =>
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
    <div className="flex flex-col w-full pl-3 pr-5 gap-4">
      <div>
        <div className="mb-2 text-base font-semibold">Task ID:</div>
        <div className="flex justify-between gap-16 mb-4">
          <p className="text-finnieTeal-100 underline select-text">
            {publicKey}
          </p>
          <div className="-mt-8">
            <SourceCodeButton repositoryUrl={metadata?.repositoryUrl || ''} />
          </div>
        </div>
      </div>
      <div className="-mt-8">
        <div className="mb-2 text-base font-semibold">Description:</div>
        <p className="mb-4 select-text">
          {metadata?.description ?? NOT_AVAILABLE}
        </p>
      </div>

      <div className="mb-6 w-full flex">
        <div className="basis-1/2">
          <div className="mb-2 text-base font-semibold">Details:</div>
          <div className="grid grid-cols-2 gap-y-2 gap-x-12">
            <div className="select-text">Nodes: {nodes}</div>
            <div className="select-text">Bounty: {bounty}</div>
            <div className="select-text">Min stake: {minStake}</div>
            <div className="select-text">Top stake: {topStake}</div>
          </div>
        </div>

        <div className="basis-1/2">
          <div className="mb-2 text-base font-semibold">Specifications:</div>
          <div className="grid grid-cols-2 gap-y-2 gap-x-12">
            {specs?.map(({ type, value }, index) => (
              <div key={index} className="select-text">
                {type}: {value ?? NOT_AVAILABLE}
              </div>
            ))}
          </div>
        </div>
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
  );
}
