import React, { RefObject, useMemo } from 'react';

import IPFSIcon from 'assets/svgs/ipfs-icon.svg';
import config from 'config';
import { TaskPairing } from 'models';
import { TaskMetadata } from 'models/task';
import { CopyButton, Tooltip } from 'renderer/components/ui';
import { useClipboard } from 'renderer/features/common';
import { openBrowserWindow } from 'renderer/services';
import { getKoiiFromRoe } from 'utils';

import { formatNumber } from '../../utils';
import { Address } from '../AvailableTaskRow/components/Address';

import { TaskActions } from './components/TaskActions';
import { TaskDescription } from './components/TaskDescription';
import { TaskStats } from './components/TaskStats';
import { UpgradeInfo } from './components/UpgradeInfo';
import { Setting } from './Setting';

type PropsType = {
  publicKey: string;
  creator: string;
  metadataCID: string;
  metadata?: TaskMetadata;
  details: {
    nodesNumber: number;
    minStake: number;
    topStake: number;
    bounty: number;
  };
  variables?: TaskPairing[];
  shouldDisplayToolsInUse?: boolean;
  showSourceCode?: boolean;
  isRunning?: boolean;
  isUpgradeInfo?: boolean;
  onOpenAddTaskVariableModal?: (
    dropdownRef: RefObject<HTMLButtonElement>,
    settingName: string
  ) => void;
  shouldDisplayArchiveButton?: boolean;
  isOnboardingTask?: boolean;
  totalStake: number;
};

export function TaskInfo({
  publicKey,
  creator,
  metadataCID,
  metadata,
  details: { nodesNumber, topStake, bounty },
  variables,
  shouldDisplayToolsInUse,
  showSourceCode = true,
  isRunning,
  isUpgradeInfo,
  onOpenAddTaskVariableModal,
  shouldDisplayArchiveButton,
  totalStake,
}: PropsType) {
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

  /**
   * @todo: replace with real token ticker, when api is ready
   */
  const tokenTicker = 'KOII';
  const totalStakeFormatted = useMemo(
    () => getKoiiFromRoe(totalStake),
    [totalStake]
  );

  const taskStatistics = useMemo(
    () => [
      { label: 'Token', value: tokenTicker },
      {
        label: 'Bounty',
        value: `${formatNumber(bounty, false)}`,
        fullValue: bounty,
      },
      {
        label: 'Top Stake',
        value: `${formatNumber(topStake, false)}`,
        fullValue: topStake,
      },
      {
        label: 'Total Stake',
        value: formatNumber(totalStakeFormatted, false),
        fullValue: totalStakeFormatted,
      },
      { label: 'Nodes', value: nodesNumber },
    ],
    [bounty, nodesNumber, topStake, totalStakeFormatted]
  );

  return (
    <div className="flex flex-col w-full gap-4 pl-3 pr-5">
      <UpgradeInfo
        isUpgradeInfo={isUpgradeInfo}
        migrationDescription={metadata?.migrationDescription}
      />

      <div className="flex justify-between">
        <div className="flex flex-col gap-8">
          <div className="flex items-center text-start gap-9">
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

        <TaskActions
          publicKey={publicKey}
          showSourceCode={showSourceCode}
          repositoryUrl={metadata?.repositoryUrl}
          shouldDisplayArchiveButton={shouldDisplayArchiveButton}
        />
      </div>

      <TaskStats taskStatistics={taskStatistics} />

      <TaskDescription description={metadata?.description} />

      {/* <div className="flex justify-between w-full mb-6 text-start">
        <div className={taskSpecificationClass}>
          <div className="mb-2 text-base font-semibold">Specifications</div>
          <div className={gridClass}>
            {specs?.map(({ type, value }, index) => (
              <div key={index} className="select-text">
                {type}: {value ?? NOT_AVAILABLE_PLACEHOLDER}
              </div>
            ))}
          </div>
        </div>
      </div> */}

      {shouldDisplayToolsInUse && !!variables?.length && (
        <div>
          <div className="mb-2 text-base font-semibold">Settings</div>
          {/* Adjust the grid-cols class as needed for different breakpoints */}
          <div className="flex flex-wrap w-full gap-x-6">
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
