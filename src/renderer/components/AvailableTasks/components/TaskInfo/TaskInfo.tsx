import React from 'react';

import { TaskPairing } from 'models';
import { RequirementType, TaskMetadata } from 'models/task';
import { SourceCodeButton } from 'renderer/components/SourceCodeButton';
import { Tooltip } from 'renderer/components/ui';

import { Address } from '../Address';

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
  showSourceCode?: boolean;
};

const NOT_AVAILABLE = '-';

export function TaskInfo({
  publicKey,
  metadata,
  details: { nodes, minStake, topStake, bounty },
  variables,
  shouldDisplayToolsInUse,
  showSourceCode = true,
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
        <div className="mb-2 text-base font-semibold">Task ID</div>
        <div className="flex items-end mb-4 text-finnieTeal-100">
          <Tooltip tooltipContent="Inspect Task" placement="top-left">
            <Address address={publicKey} className=" select-text" />
          </Tooltip>

          <div className="-mb-1">
            {showSourceCode && metadata?.repositoryUrl && (
              <SourceCodeButton repositoryUrl={metadata?.repositoryUrl || ''} />
            )}
          </div>
        </div>
      </div>
      <div>
        <div className="mb-2 text-base font-semibold">Description</div>
        <p className="mb-4 select-text text-sm">
          {metadata?.description ?? NOT_AVAILABLE}
        </p>
      </div>

      <div className="mb-6 w-full flex justify-between">
        <div className="max-w-[48%] w-full">
          <div className="mb-2 text-base font-semibold">Details</div>
          <div className="grid grid-cols-2 gap-y-2 gap-x-12">
            <div className="select-text">Nodes: {nodes ?? NOT_AVAILABLE}</div>
            <div className="select-text">Bounty: {bounty ?? NOT_AVAILABLE}</div>
            <div className="select-text">
              Min stake: {minStake ?? NOT_AVAILABLE}
            </div>
            <div className="select-text">
              Top stake: {topStake ?? NOT_AVAILABLE}
            </div>
          </div>
        </div>

        <div className="max-w-[48%] w-full">
          <div className="mb-2 text-base font-semibold">Specifications</div>
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
        <div>
          <div className="mb-2 text-base font-semibold">Settings</div>
          <div className="flex flex-col">
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
