import React, { RefObject } from 'react';
import { twMerge } from 'tailwind-merge';

import { TaskPairing } from 'models';
import { RequirementType, TaskMetadata } from 'models/task';
import { SourceCodeButton } from 'renderer/components/SourceCodeButton';
import { Tooltip } from 'renderer/components/ui';

import { Address } from '../Address';

import { Setting } from './Setting';

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
  isRunning?: boolean;
  isOnboardingTask?: boolean;
  onOpenAddTaskVariableModal?: (
    dropdownRef: RefObject<HTMLButtonElement>,
    settingName: string
  ) => void;
};

const NOT_AVAILABLE = '-';

export function TaskInfo({
  publicKey,
  metadata,
  details: { nodes, minStake, topStake, bounty },
  variables,
  shouldDisplayToolsInUse,
  showSourceCode = true,
  isRunning,
  onOpenAddTaskVariableModal,
  isOnboardingTask,
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

  const gridClass = twMerge(
    'grid grid-cols-2 gap-y-2',
    isOnboardingTask ? 'gap-x-2' : 'gap-x-12'
  );
  const taskDetailsClass = twMerge(
    ' w-full',
    isOnboardingTask ? 'max-w-[60%] xl:max-w-[48%]' : 'max-w-[48%]'
  );
  const taskSpecificationClass = twMerge(
    ' w-full text-start',
    isOnboardingTask ? 'max-w-[40%] xl:max-w-[48%]' : 'max-w-[48%]'
  );
  return (
    <div className="flex flex-col w-full pl-3 pr-5 gap-4">
      <div className="text-start">
        <div className="mb-2 text-base font-semibold text-finnieEmerald-light">
          Task ID
        </div>
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
      <div className="text-start">
        <div className="mb-2 text-base font-semibold text-finnieEmerald-light">
          Description
        </div>
        <p className="mb-4 select-text text-sm">
          {metadata?.description ?? NOT_AVAILABLE}
        </p>
      </div>

      <div className="mb-6 w-full flex justify-between text-start">
        <div className={taskDetailsClass}>
          <div className="mb-2 text-base text-start font-semibold text-finnieEmerald-light">
            Details
          </div>
          <div className={gridClass}>
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

        <div className={taskSpecificationClass}>
          <div className="mb-2 text-base font-semibold text-finnieEmerald-light">
            Specifications
          </div>
          <div className={gridClass}>
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
              <Setting
                publicKey={publicKey}
                isRunning={isRunning}
                key={name}
                name={name}
                label={label}
                onOpenAddTaskVariableModal={onOpenAddTaskVariableModal}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
