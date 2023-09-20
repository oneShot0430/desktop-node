import React, { RefObject, useMemo } from 'react';
import { useQuery } from 'react-query';
import { twMerge } from 'tailwind-merge';

import { TaskPairing } from 'models';
import { RequirementType, TaskMetadata } from 'models/task';
import { SourceCodeButton } from 'renderer/components/SourceCodeButton';
import { Tooltip } from 'renderer/components/ui';
import { getSchedulerTasks } from 'renderer/services';

import { Address } from '../Address';

import { Setting } from './Setting';
import { TurnSchedulerOnOffOnTask } from './TurnSchedulerOnOffOnTask';

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
  isUpgradeInfo?: boolean;
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
  isUpgradeInfo,
  onOpenAddTaskVariableModal,
  isOnboardingTask,
}: PropsType) {
  const { data: schedulerTasks, isLoading: isLoadingSchedulerTasks } = useQuery(
    ['schedulerTasks', publicKey],
    getSchedulerTasks,
    {
      enabled: !!publicKey,
      retry: 3,
    }
  );

  const isScheduledTask = useMemo(
    () => schedulerTasks?.includes(publicKey),
    [publicKey, schedulerTasks]
  );

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
    <div className="flex flex-col w-full gap-4 pl-3 pr-5">
      {isUpgradeInfo && (
        <div className="text-start">
          <div className="mb-2 text-base font-semibold text-finnieEmerald-light">
            What&apos;s New
          </div>
          <p className="mb-4 text-sm select-text">
            {metadata?.migrationDescription ?? NOT_AVAILABLE}
          </p>
        </div>
      )}
      <div className="flex justify-between">
        <div className="text-start">
          <div className="mb-2 text-base font-semibold text-finnieEmerald-light">
            Task ID
          </div>
          <div className="flex items-end mb-4 text-finnieTeal-100">
            <Tooltip tooltipContent="Inspect Task" placement="top-left">
              <Address address={publicKey} className="select-text " />
            </Tooltip>

            <div className="-mb-1">
              {showSourceCode && metadata?.repositoryUrl && (
                <SourceCodeButton
                  repositoryUrl={metadata?.repositoryUrl || ''}
                />
              )}
            </div>
          </div>
        </div>
        <div>
          {!isLoadingSchedulerTasks && (
            <TurnSchedulerOnOffOnTask
              taskPublicKey={publicKey}
              defaultValue={isScheduledTask}
            />
          )}
        </div>
      </div>

      <div className="text-start">
        <div className="mb-2 text-base font-semibold text-finnieEmerald-light">
          Description
        </div>
        <p className="mb-4 text-sm select-text">
          {metadata?.description ?? NOT_AVAILABLE}
        </p>
      </div>

      <div className="flex justify-between w-full mb-6 text-start">
        <div className={taskDetailsClass}>
          <div className="mb-2 text-base font-semibold text-start text-finnieEmerald-light">
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
                isEditDisabled={isUpgradeInfo}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
