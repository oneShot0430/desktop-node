import {
  PauseFill,
  PlayFill,
  Icon,
  CloseLine,
  InformationCircleLine,
  ClickXlLine,
} from '@_koii/koii-styleguide';
import { useAutoAnimate } from '@formkit/auto-animate/react';
import React, {
  MutableRefObject,
  RefObject,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import { toast } from 'react-hot-toast';
import { useQuery, useQueryClient } from 'react-query';

import { Address } from 'renderer/components/AvailableTasks/components/Address';
import { TaskInfo } from 'renderer/components/AvailableTasks/components/TaskInfo';
import { RoundTime } from 'renderer/components/RoundTime';
import {
  Button,
  Tooltip,
  LoadingSpinner,
  LoadingSpinnerSize,
  TableRow,
  ColumnsLayout,
  Status,
} from 'renderer/components/ui';
import { useMyNodeContext, useStakingAccount } from 'renderer/features';
import {
  useAddStakeModal,
  useUnstakeModal,
  useTaskStake,
  useMetadata,
  useOnClickOutside,
  useTaskStatus,
  useAddTaskVariableModal,
} from 'renderer/features/common';
import {
  stopTask,
  startTask,
  TaskService,
  QueryKeys,
  getTaskPairedVariablesNamesWithLabels,
  openLogfileFolder,
  getActiveAccountName,
  getAllTimeRewards,
  getIsTaskRunning,
} from 'renderer/services';
import { Task, TaskStatus } from 'renderer/types';
import { getCreatedAtDate, getKoiiFromRoe } from 'utils';

import { OptionsDropdown } from './OptionsDropdown';

type PropsType = {
  task: Task;
  accountPublicKey: string;
  index: number;
  columnsLayout: ColumnsLayout;
  totalItems: number;
  isPrivate: boolean;
};

export function TaskItem({
  task,
  accountPublicKey,
  index,
  columnsLayout,
  totalItems,
  isPrivate,
}: PropsType) {
  const [shouldDisplayInfo, setShouldDisplayInfo] = useState(false);
  const [shouldDisplayActions, setShouldDisplayActions] = useState(false);
  const [loading, setLoading] = useState(false);
  const [hideTooltip, setHideTooltip] = useState(false);
  const [pendingRewards, setPendingRewards] = useState(0);
  const [claimedRewards, setClaimedRewards] = useState(0);
  const [isAddTaskSettingModalOpen, setIsAddTaskSettingModalOpen] =
    useState(false);

  const { fetchMyTasksEnabled } = useMyNodeContext();

  const { taskName, isRunning: originalIsRunning, publicKey, roundTime } = task;

  const { data: alternativeIsRunning = false } = useQuery(
    [QueryKeys.IsRunning, publicKey],
    () => getIsTaskRunning(publicKey),
    {
      enabled: !fetchMyTasksEnabled,
    }
  );

  // while claiming rewards we disable updates to tasks in My Node,
  // this workaround allows us to update the play/pause state if the user plays/pauses the task
  const isRunning = fetchMyTasksEnabled
    ? originalIsRunning
    : alternativeIsRunning;

  const { showModal: showAddTaskSettingModal } = useAddTaskVariableModal();

  const { taskStake, refetchTaskStake } = useTaskStake({
    task,
    publicKey: accountPublicKey,
  });
  const { showModal: showAddStake } = useAddStakeModal({
    task,
  });
  const { showModal: showUnstake } = useUnstakeModal({
    task,
  });
  const showAddStakeModal = () => {
    showAddStake().then(() => {
      refetchTaskStake();
    });
  };
  const showUnstakeModal = () => {
    showUnstake().then(() => {
      refetchTaskStake();
    });
  };
  const queryCache = useQueryClient();

  const { data: stakingAccountPublicKey = '' } = useStakingAccount();
  const { taskStatus, isLoadingStatus } = useTaskStatus({
    task: { ...task, isRunning },
    stakingAccountPublicKey,
  });

  useEffect(() => {
    getAllTimeRewards(task.publicKey).then((reward) => {
      setClaimedRewards(reward);
    });
    const pendingRewards =
      TaskService.getPendingRewardsByTask(task, stakingAccountPublicKey) || 0;
    setPendingRewards(pendingRewards);
  }, [task, stakingAccountPublicKey]);

  const allTimeRewards = claimedRewards + pendingRewards;
  const allTimeRewardsInKoii = getKoiiFromRoe(allTimeRewards);
  const pendingRewardsInKoii = getKoiiFromRoe(pendingRewards);
  const myStakeInKoii = getKoiiFromRoe(taskStake);
  const totalBountyInKoii = getKoiiFromRoe(task.totalBountyAmount);
  const isFirstRowInTable = index === 0;
  const optionsDropdownIsInverted = totalItems > 3 && index > totalItems - 2;

  const nodes = useMemo(() => TaskService.getNodesCount(task), [task]);
  const topStake = useMemo(() => TaskService.getTopStake(task), [task]);

  const { metadata, isLoadingMetadata } = useMetadata({
    metadataCID: task.metadataCID,
  });

  const { data: pairedVariables, isLoading: isLoadingPairedVariables } =
    useQuery([QueryKeys.StoredTaskPairedTaskVariables, task.publicKey], () =>
      getTaskPairedVariablesNamesWithLabels(task.publicKey)
    );
  const { data: accountName = '' } = useQuery(
    QueryKeys.MainAccountName,
    getActiveAccountName
  );

  const handleToggleTask = async () => {
    try {
      setLoading(true);
      if (isRunning) {
        await stopTask(publicKey);
      } else {
        await startTask(publicKey);
      }
    } catch (error) {
      console.warn(error);
    } finally {
      queryCache.invalidateQueries();
      setLoading(false);
    }
  };

  const handleOpenAddTaskVariableModal = async (
    dropdownRef: RefObject<HTMLButtonElement>,
    settingName: string
  ) => {
    setIsAddTaskSettingModalOpen((isOpen) => !isOpen);
    const wasSettingAdded = await showAddTaskSettingModal(settingName);
    setIsAddTaskSettingModalOpen(false);
    // focus on dropdown after creating new setting
    if (wasSettingAdded) {
      setTimeout(() => {
        dropdownRef?.current?.click();
      }, 100);
    }
  };

  const createdAt = useMemo(
    () => getCreatedAtDate(metadata?.createdAt),
    [metadata]
  );

  const [parent] = useAutoAnimate();

  const infoRef = useRef<HTMLDivElement>(null);
  const optionsDropdownRef = useRef<HTMLDivElement>(null);

  const closeAccordionView = () =>
    !isAddTaskSettingModalOpen && setShouldDisplayInfo(false);
  const closeOptionsDropdown = () => setShouldDisplayActions(false);
  const openTaskLogs = async () => {
    const openedTheLogs: boolean = await openLogfileFolder(task.publicKey);
    if (!openedTheLogs) {
      toast.error('Unable to open the logs folder. Try Again', {
        icon: <CloseLine className="w-5 h-5" />,
        style: {
          backgroundColor: '#FFA6A6',
          paddingRight: 0,
        },
      });
    }
  };

  useOnClickOutside(
    infoRef as MutableRefObject<HTMLDivElement>,
    closeAccordionView
  );
  useOnClickOutside(
    optionsDropdownRef as MutableRefObject<HTMLDivElement>,
    closeOptionsDropdown
  );

  const minStake = getKoiiFromRoe(task.minimumStakeAmount);
  const details = {
    nodes,
    minStake,
    topStake: getKoiiFromRoe(topStake),
    bounty: totalBountyInKoii,
  };
  const isBountyEmpty = task.totalBountyAmount < task.bountyAmountPerRound;
  const isTaskDelisted = !task.isWhitelisted || !task.isActive;
  const isPlayPauseButtonDisabled =
    !isRunning && (!(myStakeInKoii > 0) || isTaskDelisted || isBountyEmpty);

  const containerClasses = `py-2.5 gap-y-0 ${
    taskStatus === TaskStatus.FLAGGED
      ? 'bg-[#FF4141]/25'
      : [TaskStatus.ERROR, TaskStatus.BLACKLISTED].includes(taskStatus) ||
        isBountyEmpty
      ? 'bg-[#FF4141]/20'
      : !isRunning
      ? 'bg-[#FFA54B]/25'
      : ''
  }`;
  const tooltipContent =
    !isRunning && isTaskDelisted
      ? "This task has been delisted, but don't worry! Your tokens are safe and will be ready to unstake after 3 rounds."
      : isTaskDelisted
      ? "This task has been delisted, but don't worry! Your tokens are safe. Pause the task and the tokens will be ready to unstake after 3 rounds."
      : myStakeInKoii > 0
      ? `${isRunning ? 'Stop' : 'Start'} task`
      : `You need to stake at least ${minStake} KOII on this task to run it.`;

  const handleHideMainTooltip = () => {
    setHideTooltip(true);
  };

  const handleShowMainTooltip = () => {
    setHideTooltip(false);
  };

  const propsManagingMainTooltipState = {
    onFocus: handleHideMainTooltip,
    onMouseOver: handleHideMainTooltip,
    onBlur: handleShowMainTooltip,
    onMouseLeave: handleShowMainTooltip,
  };

  return (
    <Tooltip
      groupName="task"
      tooltipContent="This task is inactive because the bounty is empty. The creator needs to refill the bounty before you can run it again."
      placement={`${isFirstRowInTable ? 'bottom' : 'top'}-right`}
      forceHide={!isBountyEmpty || hideTooltip}
    >
      <TableRow
        columnsLayout={columnsLayout}
        className={containerClasses}
        ref={infoRef}
      >
        <div {...propsManagingMainTooltipState}>
          {loading ? (
            <div>
              <LoadingSpinner size={LoadingSpinnerSize.Large} />
            </div>
          ) : (
            <Tooltip
              tooltipContent={tooltipContent}
              placement={`${isFirstRowInTable ? 'bottom' : 'top'}-right`}
            >
              <Button
                onlyIcon
                icon={
                  <Icon
                    source={
                      isRunning && myStakeInKoii > 0 ? PauseFill : PlayFill
                    }
                    size={18}
                    className={`${
                      isRunning && myStakeInKoii > 0
                        ? 'text-finniePurple'
                        : 'text-white'
                    }
                  ${isPlayPauseButtonDisabled && 'opacity-60'}`}
                  />
                }
                onClick={handleToggleTask}
                className="w-8 h-8 rounded-full"
                disabled={isPlayPauseButtonDisabled}
              />
            </Tooltip>
          )}
        </div>
        <div className="flex gap-3 justify-self-start">
          <Tooltip
            placement={`${isFirstRowInTable ? 'bottom' : 'top'}-right`}
            tooltipContent="Open task details"
          >
            <div
              {...propsManagingMainTooltipState}
              className="flex flex-col items-center justify-start w-10"
            >
              <Button
                onClick={() =>
                  setShouldDisplayInfo(
                    (shouldDisplayInfo) => !shouldDisplayInfo
                  )
                }
                icon={
                  <Icon
                    source={InformationCircleLine}
                    size={36}
                    className={
                      shouldDisplayInfo ? 'text-finnieTeal' : 'text-white'
                    }
                  />
                }
                onlyIcon
              />
            </div>
          </Tooltip>
          <div className="flex flex-col gap-1 text-xs justify-self-start">
            <div>{taskName}</div>
            <div className="text-finnieTeal">{createdAt}</div>
          </div>
        </div>
        <div className="flex flex-col gap-2 text-xs min-w-[130px] w-full justify-self-start">
          <div className="truncate">
            Creator: <Address address={task.taskManager} />
          </div>
          <div className="truncate">{`Account: ${accountName}`}</div>
        </div>
        <div className="flex flex-col gap-2 text-xs min-w-[50px] w-fit text-left mr-auto ml-[20%] xl:ml-[40%] 2xl:ml-[50%]">
          <div className="truncate">{`Staked: ${myStakeInKoii}`}</div>
          <div className="truncate">{`Bounty: ${totalBountyInKoii}`}</div>
        </div>
        <div className="flex flex-col gap-2 text-xs w-fit">
          <div className="mx-auto truncate">{`All time: ${allTimeRewardsInKoii}`}</div>
          <div className="mx-auto truncate">{`To claim: ${pendingRewardsInKoii}`}</div>
        </div>
        <div {...propsManagingMainTooltipState}>
          <RoundTime
            tooltipPlacement={`${isFirstRowInTable ? 'bottom' : 'top'}-left`}
            roundTime={roundTime}
          />
        </div>
        <div {...propsManagingMainTooltipState}>
          <Status
            status={taskStatus}
            isFirstRowInTable={isFirstRowInTable}
            isLoading={isLoadingStatus}
            isRunning={isRunning}
          />
        </div>
        <div
          ref={optionsDropdownRef}
          className="relative flex flex-row items-center gap-4"
        >
          <Button
            onClick={() =>
              setShouldDisplayActions(
                (shouldDisplayActions) => !shouldDisplayActions
              )
            }
            onlyIcon
            icon={
              <Icon source={ClickXlLine} className="w-10 h-10 text-white" />
            }
            className={`py-0.75 !pr-[0.5px] rounded-full ${
              shouldDisplayActions ? 'bg-[#454580]' : 'bg-transparent'
            } h-12 w-12`}
          />
          {shouldDisplayActions && (
            <OptionsDropdown
              addStake={showAddStakeModal}
              unstake={showUnstakeModal}
              openLogs={openTaskLogs}
              runOrStopTask={handleToggleTask}
              task={task}
              isInverted={optionsDropdownIsInverted}
            />
          )}
        </div>
        <div
          className={`w-full col-span-9 overflow-y-auto inner-scrollbar ${
            shouldDisplayInfo
              ? // 9000px is just a simbolic value of a ridiculously high height, the animation needs absolute max-h values to work properly (fit/max/etc won't work)
                'opacity-1 pt-6 max-h-[9000px]'
              : 'opacity-0 max-h-0'
          } transition-all duration-500 ease-in-out`}
        >
          <div ref={parent} className="flex w-full">
            {shouldDisplayInfo &&
            (isLoadingMetadata || isLoadingPairedVariables) ? (
              <div className="m-auto">
                <LoadingSpinner />
              </div>
            ) : (
              <TaskInfo
                publicKey={task.publicKey}
                variables={pairedVariables}
                metadata={metadata ?? undefined}
                details={details}
                isRunning={isRunning}
                onOpenAddTaskVariableModal={handleOpenAddTaskVariableModal}
                shouldDisplayToolsInUse
              />
            )}
          </div>
        </div>
      </TableRow>
    </Tooltip>
  );
}
