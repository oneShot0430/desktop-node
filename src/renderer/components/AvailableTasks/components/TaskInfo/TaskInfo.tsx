import { Icon } from '@_koii/koii-styleguide';
import React, { RefObject, useMemo } from 'react';
import { useQuery } from 'react-query';
import { twMerge } from 'tailwind-merge';

import Archive from 'assets/svgs/archive.svg';
import ExploreIcon from 'assets/svgs/explore-icon.svg';
import IPFSIcon from 'assets/svgs/ipfs-icon.svg';
import config from 'config';
import { TaskPairing } from 'models';
import { RequirementType, TaskMetadata } from 'models/task';
import { SourceCodeButton } from 'renderer/components/SourceCodeButton';
import { CopyButton, LoadingSpinner, Tooltip } from 'renderer/components/ui';
import { useClipboard } from 'renderer/features/common';
import useArchive from 'renderer/features/common/hooks/useArchive';
import { getSchedulerTasks, openBrowserWindow } from 'renderer/services';

import { Address } from '../Address';

import { Setting } from './Setting';
import { TurnSchedulerOnOffOnTask } from './TurnSchedulerOnOffOnTask';

type PropsType = {
  publicKey: string;
  creator: string;
  metadataCID: string;
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
  pendingRewards?: number;
  shouldDisplayArchiveButton?: boolean;
};

const NOT_AVAILABLE = '-';

export function TaskInfo({
  publicKey,
  creator,
  metadataCID,
  metadata,
  details: { nodes, minStake, topStake, bounty },
  variables,
  shouldDisplayToolsInUse,
  showSourceCode = true,
  isRunning,
  isUpgradeInfo,
  onOpenAddTaskVariableModal,
  isOnboardingTask,
  pendingRewards,
  shouldDisplayArchiveButton,
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
    'grid grid-cols-2 gap-y-2 font-light',
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

  const { copyToClipboard: copyTaskId, copied: copiedTaskId } = useClipboard();

  const handleCopyTaskId = () => {
    copyTaskId(publicKey);
  };

  const { copyToClipboard: copyCreatorAddress, copied: copiedCreatorAddress } =
    useClipboard();

  const handleCopyCreatorAddress = () => {
    copyCreatorAddress(creator);
  };

  const handleOpenMetadataInBrowser = () =>
    openBrowserWindow(
      `${config.node.IPFS_GATEWAY_URL}/${metadataCID}/metadata.json`
    );

  const { archiveTask, isArchivingTask } = useArchive({
    taskPublicKey: publicKey,
    pendingRewards,
  });

  return (
    <div className="flex flex-col w-full gap-4 pl-3 pr-5">
      {isUpgradeInfo && (
        <div className="text-start">
          <div className="mb-2 text-base font-semibold text-finnieEmerald-light">
            What&apos;s New
          </div>
          <p className="mb-4 text-sm font-light select-text">
            {metadata?.migrationDescription ?? NOT_AVAILABLE}
          </p>
        </div>
      )}

      <div className="flex justify-between">
        <div>
          <div className="flex items-center mb-4 text-start gap-9">
            <div className="text-base font-semibold">Task ID</div>
            <div className="flex items-center gap-3">
              <Tooltip
                tooltipContent="Check task's metadata on IPFS"
                placement="bottom-right"
              >
                <IPFSIcon
                  className="cursor-pointer"
                  onClick={handleOpenMetadataInBrowser}
                />
              </Tooltip>
              <Tooltip tooltipContent="Inspect Task" placement="bottom-left">
                <Address address={publicKey} className="select-text " />
              </Tooltip>

              <CopyButton
                onCopy={handleCopyTaskId}
                isCopied={copiedTaskId}
                className="mb-1"
              />
            </div>
          </div>
          <div className="flex items-center gap-16 text-start">
            <div className="h-full text-base font-semibold">Creator</div>
            <div className="flex items-center h-full gap-3">
              <Address address={creator} className="select-text " />

              <CopyButton
                onCopy={handleCopyCreatorAddress}
                isCopied={copiedCreatorAddress}
                className="mb-1"
              />
            </div>
          </div>
        </div>

        <div className="flex flex-col items-start w-fit">
          <div className="flex flex-col gap-4 mr-5 text-right">
            <div className="flex justify-end">
              {!isLoadingSchedulerTasks && (
                <TurnSchedulerOnOffOnTask
                  taskPublicKey={publicKey}
                  defaultValue={isScheduledTask}
                />
              )}
            </div>
            {showSourceCode && (
              <SourceCodeButton repositoryUrl={metadata?.repositoryUrl || ''} />
            )}
            <Address
              address={publicKey}
              overrideLabel={
                <div className="flex gap-2">
                  <Icon source={ExploreIcon} className="w-6 h-6" />
                  <span>Explore history</span>
                </div>
              }
              className="ml-auto text-right select-text"
            />

            {shouldDisplayArchiveButton &&
              (isArchivingTask ? (
                <LoadingSpinner className="w-6 h-6 ml-auto" />
              ) : (
                <button
                  className="flex gap-3 ml-auto text-right hover:underline"
                  onClick={() => archiveTask()}
                >
                  <Icon source={Archive} className="w-4 h-4" />
                  Archive
                </button>
              ))}
          </div>
        </div>
      </div>

      <div className="text-start">
        <div className="mb-2 text-base font-semibold">Description</div>
        <p className="mb-4 text-sm font-light select-text">
          {metadata?.description ?? NOT_AVAILABLE}
        </p>
      </div>

      <div className="flex justify-between w-full mb-6 text-start">
        <div className={taskDetailsClass}>
          <div className="mb-2 text-base font-semibold text-start">Details</div>
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
          <div className="mb-2 text-base font-semibold">Specifications</div>
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
