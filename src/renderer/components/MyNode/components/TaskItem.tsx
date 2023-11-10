import {
  PauseFill,
  PlayFill,
  Icon,
  InformationCircleLine,
} from '@_koii/koii-styleguide';
import { useAutoAnimate } from '@formkit/auto-animate/react';
import React, {
  MutableRefObject,
  RefObject,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import { toast } from 'react-hot-toast';
import { useQuery, useQueryClient } from 'react-query';

import CancelButton from 'assets/svgs/cancel-button.svg';
import ArrowIcon from 'assets/svgs/chevron-no-circle.svg';
import RetryAnim from 'assets/svgs/history-icon.svg';
import DotsSvg from 'assets/svgs/options.svg';
import UpdateIcon from 'assets/svgs/update-icon.svg';
import UploadLine from 'assets/svgs/upload-line.svg';
import { TASK_RETRY_DATA_REFETCH_INTERVAL } from 'config/refetchIntervals';
import { get, noop, uniqBy } from 'lodash';
import { RequirementType } from 'models';
import { Address } from 'renderer/components/AvailableTasks/components/Address';
import { TaskInfo } from 'renderer/components/AvailableTasks/components/TaskInfo';
import { TaskSettings } from 'renderer/components/AvailableTasks/components/TaskSettings';
import { getTooltipContent } from 'renderer/components/AvailableTasks/utils';
import { RoundTime } from 'renderer/components/RoundTime';
import {
  Button,
  Tooltip,
  LoadingSpinner,
  LoadingSpinnerSize,
  TableRow,
  ColumnsLayout,
  Status,
  Placement,
} from 'renderer/components/ui';
import { DROPDOWN_MENU_ID } from 'renderer/components/ui/Dropdown/Dropdown';
import { useMyNodeContext, useStakingAccount } from 'renderer/features';
import {
  useAddStakeModal,
  useUnstakeModal,
  useTaskStake,
  useMetadata,
  useOnClickOutside,
  useTaskStatus,
  useAddTaskVariableModal,
  useUnstakingAvailability,
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
  cancelTaskRetry,
  getRetryDataByTaskId,
} from 'renderer/services';
import { Task, TaskStatus } from 'renderer/types';
import { getKoiiFromRoe, getBestTooltipPosition } from 'utils';

import { OptionsDropdown } from './OptionsDropdown';
import {
  UpgradeInProgressContent,
  UpgradeSucceededContent,
  UpgradeFailedContent,
  UpgradeAvailableContent,
  ConfirmUpgradeContent,
  NewVersionInAudit,
  PrivateUpgradeWarning,
} from './taskUpgrade';
import useCountDown from './useCountDown';
import { UpgradeStatus, useUpgradeTask } from './useUpgradeTask';

type PropsType = {
  task: Task;
  accountPublicKey: string;
  index: number;
  columnsLayout: ColumnsLayout;
  isPrivate: boolean;
  tableRef: RefObject<HTMLDivElement>;
};

export function TaskItem({
  task,
  accountPublicKey,
  index,
  columnsLayout,
  isPrivate,
  tableRef,
}: PropsType) {
  const [isArchivingTask, setIsArchivingTask] = useState(false);
  const [accordionView, setAccordionView] = useState<
    'info' | 'upgrade-info' | 'upgrade-settings' | null
  >(null);
  const [shouldDisplayActions, setShouldDisplayActions] = useState(false);
  const [loading, setLoading] = useState(false);
  const [hideTooltip, setHideTooltip] = useState(false);
  const [pendingRewards, setPendingRewards] = useState(0);
  const [claimedRewards, setClaimedRewards] = useState(0);
  const [isAddTaskSettingModalOpen, setIsAddTaskSettingModalOpen] =
    useState(false);
  const [isTaskSettingsValid, setIsTaskSettingsValid] = useState(false);

  const { fetchMyTasksEnabled } = useMyNodeContext();

  const { taskName, isRunning: originalIsRunning, publicKey, roundTime } = task;

  const { data: alternativeIsRunning = false } = useQuery(
    [QueryKeys.IsRunning, publicKey],
    () => getIsTaskRunning(publicKey),
    {
      enabled: !fetchMyTasksEnabled,
    }
  );

  const { data: taskRetryData = null } = useQuery(
    [QueryKeys.TaskRetryData, publicKey],
    () => getRetryDataByTaskId(publicKey),
    {
      refetchInterval: TASK_RETRY_DATA_REFETCH_INTERVAL,
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

  const { canUnstake } = useUnstakingAvailability({
    task,
    stakingAccountPublicKey,
  });

  const myStakeInKoii = getKoiiFromRoe(taskStake);

  const isCoolingDown = useMemo(
    () => !canUnstake && !!myStakeInKoii,
    [canUnstake, myStakeInKoii]
  );

  const {
    upgradeStatus,
    upgradeTask,
    setUpgradeStatus,
    newTaskVersion,
    isLoadingNewTaskVersion,
    newTaskVersionVariables,
    newTaskVersionPairedVariables,
    isLoadingNewTaskVersionPairedVariables,
    newTaskVersionPairedVariablesWithLabel,
    newTaskVersionMetadata,
    isLoadingNewTaskVersionMetadata,
    newTaskVersionDetails,
    newTaskVersionStake,
  } = useUpgradeTask({
    task,
    oldTaskIsPrivate: isPrivate,
    oldTaskIsCoolingDown: isCoolingDown,
  });

  const stopTaskIfDelisted = useCallback(async () => {
    if (isRunning && !task.isActive) {
      try {
        await stopTask(publicKey);
      } catch (error) {
        console.error(error);
      }
    }
  }, [isRunning, task.isActive, publicKey]);

  useEffect(() => {
    stopTaskIfDelisted();
  }, [stopTaskIfDelisted]);

  useEffect(() => {
    getAllTimeRewards(task.publicKey).then((reward) => {
      setClaimedRewards(reward);
    });
    const pendingRewards =
      TaskService.getPendingRewardsByTask(task, stakingAccountPublicKey) || 0;
    setPendingRewards(pendingRewards);
  }, [task, stakingAccountPublicKey]);

  const { metadata, isLoadingMetadata } = useMetadata({
    metadataCID: task.metadataCID,
  });
  const isLoadingMetadataFlag =
    accordionView === 'upgrade-info'
      ? isLoadingNewTaskVersionMetadata
      : isLoadingMetadata;

  const oldTaskVersionVariables = metadata?.requirementsTags.filter(
    ({ type }) =>
      [RequirementType.TASK_VARIABLE, RequirementType.GLOBAL_VARIABLE].includes(
        type
      )
  );

  const newTaskVariableSet = new Set(
    newTaskVersionVariables?.map((v) => v.name)
  );
  const oldTaskVariableSet = new Set(
    oldTaskVersionVariables?.map((v) => v.value)
  );

  const upgradeUsesDifferentVariables = !!(
    newTaskVersionVariables?.some((v) => !oldTaskVariableSet.has(v.name)) ||
    oldTaskVersionVariables?.some(
      (v) => !newTaskVariableSet.has(v?.value || '')
    )
  );

  useEffect(() => {
    const validateAllVariablesWerePaired = () => {
      const numberOfPairedVariables = Object.keys(
        newTaskVersionPairedVariables || {}
      ).length;

      const allVariablesWerePaired =
        (newTaskVersionVariables?.length || 0) === numberOfPairedVariables;

      setIsTaskSettingsValid(allVariablesWerePaired);
    };

    validateAllVariablesWerePaired();
  }, [newTaskVersionPairedVariables, newTaskVersionVariables, taskName]);

  const allTimeRewards = claimedRewards + pendingRewards;
  const allTimeRewardsInKoii = getKoiiFromRoe(allTimeRewards);
  const pendingRewardsInKoii = getKoiiFromRoe(pendingRewards);
  const totalBountyInKoii = getKoiiFromRoe(task.totalBountyAmount);
  const isFirstRowInTable = index === 0;

  const nodes = useMemo(() => TaskService.getNodesCount(task), [task]);
  const topStake = useMemo(() => TaskService.getTopStake(task), [task]);

  const { data: pairedVariables = [], isLoading: isLoadingPairedVariables } =
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
        await startTask(publicKey, isPrivate);
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

  const handleTaskToolsValidationCheck = (isValid: boolean) => {
    setIsTaskSettingsValid(isValid);
  };

  const [parent] = useAutoAnimate();

  const infoRef = useRef<HTMLDivElement>(null);
  const optionsDropdownRef = useRef<HTMLDivElement>(null);

  const optionsDropdownIsInverted =
    getBestTooltipPosition(optionsDropdownRef.current, tableRef.current) ===
    'top';

  const closeAccordionView = () => {
    queryCache.invalidateQueries([QueryKeys.StoredPairedTaskVariables]);
    queryCache.invalidateQueries([
      QueryKeys.StoredTaskPairedTaskVariables,
      newTaskVersion?.publicKey,
    ]);
    if (!isAddTaskSettingModalOpen) {
      setAccordionView(null);
    }
  };
  const closeOptionsDropdown = () => setShouldDisplayActions(false);
  const openTaskLogs = async () => {
    const openedTheLogs: boolean = await openLogfileFolder(task.publicKey);
    if (!openedTheLogs) {
      toast.error('Unable to open the logs folder. Try Again');
    }
  };

  useOnClickOutside(
    infoRef as MutableRefObject<HTMLDivElement>,
    closeAccordionView,
    DROPDOWN_MENU_ID
  );
  useOnClickOutside(
    optionsDropdownRef as MutableRefObject<HTMLDivElement>,
    () => {
      /**
       * @dev do not close the dropdown if the user is archiving the task, so we wont lose archiving state
       */
      if (isArchivingTask) return;
      closeOptionsDropdown();
    },
    DROPDOWN_MENU_ID
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
  const isTaskNotRunning = !isRunning;
  const hasNoStake = !(myStakeInKoii > 0);
  const isDelistedPublicTask = isTaskDelisted && !isPrivate;
  const isPlayPauseButtonDisabled =
    isTaskNotRunning && (hasNoStake || isDelistedPublicTask || isBountyEmpty);
  const isAccordionOpen = accordionView !== null;
  const isLoadingAccordionInfo =
    isAccordionOpen &&
    {
      info: isLoadingMetadataFlag || isLoadingPairedVariables,
      'upgrade-info':
        isLoadingNewTaskVersion ||
        isLoadingPairedVariables ||
        isLoadingNewTaskVersionPairedVariables,
      'upgrade-settings':
        isLoadingNewTaskVersion || isLoadingNewTaskVersionPairedVariables,
    }[accordionView];

  const mainTooltipContent =
    upgradeStatus === UpgradeStatus.ACKNOWLEDGED
      ? 'This task has been updated. Upgrade now to run it.'
      : 'This task is inactive because the bounty is empty. The creator needs to refill the bounty before you can run it again.';
  const isMainTooltipHidden =
    (!isBountyEmpty && !(upgradeStatus === UpgradeStatus.ACKNOWLEDGED)) ||
    hideTooltip;
  const toggleTaskTooltipContent = getTooltipContent({
    isRunning,
    isTaskDelisted,
    myStakeInKoii,
    minStake,
    isPrivate,
  });
  const toggleTaskButtonClasses = `${
    isRunning && myStakeInKoii > 0 ? 'text-finniePurple' : 'text-white'
  }
${isPlayPauseButtonDisabled && 'opacity-60'}`;
  const infoButtonTooltipContent = `${
    accordionView === 'info' ? 'Close task details' : 'Open task details'
  }`;

  const containerClasses = `py-2.5 gap-y-0 min-h-[69px] w-full ${
    [
      UpgradeStatus.UPGRADE_AVAILABLE,
      UpgradeStatus.PRIVATE_UPGRADE_AVAILABLE,
      UpgradeStatus.IS_CONFIRMING_UPGRADE,
      UpgradeStatus.IN_PROGRESS,
    ].includes(upgradeStatus)
      ? 'bg-finnieTeal/[0.15]'
      : upgradeStatus === UpgradeStatus.ACKNOWLEDGED
      ? 'bg-[#FFA54B]/[0.15]'
      : upgradeStatus === UpgradeStatus.ERROR
      ? 'bg-finnieRed-500/20'
      : upgradeStatus === UpgradeStatus.SUCCESS
      ? 'bg-finnieEmerald-light/30'
      : taskStatus === TaskStatus.FLAGGED
      ? 'bg-finnieRed-500/25'
      : [TaskStatus.ERROR, TaskStatus.BLACKLISTED].includes(taskStatus) ||
        isBountyEmpty
      ? 'bg-finnieRed-500/20'
      : !isRunning
      ? 'bg-[#FFA54B]/25'
      : ''
  }`;
  const updateIconClasses = `stroke-[1.4px] ${
    [
      UpgradeStatus.ACKNOWLEDGED,
      UpgradeStatus.NEW_VERSION_BEING_AUDITED,
      UpgradeStatus.PRIVATE_UPGRADE_AVAILABLE,
    ].includes(upgradeStatus)
      ? 'text-finnieOrange'
      : 'text-finnieTeal'
  } ${
    [
      UpgradeStatus.UPGRADE_AVAILABLE,
      UpgradeStatus.ACKNOWLEDGED,
      UpgradeStatus.PRIVATE_UPGRADE_AVAILABLE,
    ].includes(upgradeStatus) && 'cursor-pointer'
  }`;
  const optionsButtonClasses = `py-0.75 !pr-[0.5px] rounded-full ${
    shouldDisplayActions ? 'bg-purple-5' : 'bg-transparent'
  } h-12 w-12`;
  const accordionClasses = `w-full col-span-9 overflow-y-auto inner-scrollbar ${
    accordionView !== null
      ? // 9000px is just a simbolic value of a ridiculously high height, the animation needs absolute max-h values to work properly (fit/max/etc won't work)
        'opacity-1 pt-6 max-h-[9000px]'
      : 'opacity-0 max-h-0'
  } transition-all duration-500 ease-in-out`;
  const infoIconClasses =
    accordionView === 'info' ? 'text-finnieTeal' : 'text-white';

  const handleHideMainTooltip = () => {
    setHideTooltip(true);
  };

  const handleShowMainTooltip = () => {
    setHideTooltip(false);
  };

  const handleTaskArchive = async (isArchiving: boolean) => {
    setIsArchivingTask(isArchiving);
  };

  const handleToggleInfoAccordion = () => {
    setAccordionView((currentAccordionView) =>
      currentAccordionView === 'info' ? null : 'info'
    );
  };
  const handleToggleSettingsAccordion = () => {
    setAccordionView((currentAccordionView) =>
      currentAccordionView === 'upgrade-settings' ? null : 'upgrade-settings'
    );
  };

  const handleToggleUpgradeInfoAccordion = () => {
    setAccordionView((currentAccordionView) =>
      currentAccordionView === 'upgrade-info' ? null : 'upgrade-info'
    );
  };

  const handleAcknowledgeUpgrade = () => {
    setUpgradeStatus(UpgradeStatus.ACKNOWLEDGED);
  };

  const handleMoveToConfirmUpgrade = () => {
    setUpgradeStatus(UpgradeStatus.IS_CONFIRMING_UPGRADE);
  };

  const handleMoveToPrivateUpgradeWarning = () => {
    setUpgradeStatus(UpgradeStatus.PRIVATE_UPGRADE_WARNING);
  };

  const handleDisplayPrivateUpgradeAvailable = () => {
    setUpgradeStatus(UpgradeStatus.PRIVATE_UPGRADE_AVAILABLE);
  };

  const handleDisplayUpgradeAvailable = () => {
    setUpgradeStatus(UpgradeStatus.UPGRADE_AVAILABLE);
  };

  const handleToggleOptionsDropdown = () => {
    setShouldDisplayActions((shouldDisplayActions) => !shouldDisplayActions);
  };

  const handleClickArrow =
    upgradeStatus === UpgradeStatus.IS_CONFIRMING_UPGRADE &&
    newTaskVersion?.isWhitelisted
      ? handleDisplayUpgradeAvailable
      : handleDisplayPrivateUpgradeAvailable;

  const handleClickOnUpdateIcon =
    UpgradeStatus.ACKNOWLEDGED === upgradeStatus
      ? newTaskVersion?.isWhitelisted
        ? handleDisplayUpgradeAvailable
        : handleDisplayPrivateUpgradeAvailable
      : UpgradeStatus.UPGRADE_AVAILABLE === upgradeStatus
      ? handleMoveToConfirmUpgrade
      : UpgradeStatus.PRIVATE_UPGRADE_AVAILABLE === upgradeStatus
      ? handleMoveToPrivateUpgradeWarning
      : noop;

  const hasOngoingRetry = useMemo(() => {
    const timerReference = get(taskRetryData, 'timerReference');
    const cancelled = get(taskRetryData, 'cancelled');
    if (timerReference && !cancelled) return true;
    return false;
  }, [taskRetryData]);

  const taskRetryRemainingTime = useMemo(() => {
    const timestamp = get(taskRetryData, 'timestamp');
    const count = get(taskRetryData, 'count');

    if (timestamp && count) {
      const timeHasPassed = Date.now() - timestamp;
      const totalTime = 2 ** (count + 1) * 1000;
      if (totalTime > timeHasPassed) return totalTime - timeHasPassed;
    }

    return 0;
  }, [taskRetryData]);

  const handleCancelTaskRetry = async () => {
    await cancelTaskRetry(task.publicKey);
    queryCache.invalidateQueries();
  };

  const { Counter, timeRemaining } = useCountDown({
    durationInSeconds: Math.floor(taskRetryRemainingTime / 1000),
  });

  const pairedAndUnpairedNewTaskVersionVariables = uniqBy(
    [
      ...newTaskVersionPairedVariablesWithLabel,
      ...(upgradeUsesDifferentVariables ? [] : pairedVariables),
      ...newTaskVersionVariables,
    ],
    'name'
  );

  const propsManagingMainTooltipState = {
    onFocus: handleHideMainTooltip,
    onMouseOver: handleHideMainTooltip,
    onBlur: handleShowMainTooltip,
    onMouseLeave: handleShowMainTooltip,
  };
  const taskInfoProps = {
    publicKey:
      accordionView === 'upgrade-info'
        ? newTaskVersion?.publicKey || ''
        : task.publicKey,
    creator: task.taskManager,
    variables:
      accordionView === 'upgrade-info'
        ? pairedAndUnpairedNewTaskVersionVariables
        : pairedVariables,

    metadataCID:
      accordionView === 'upgrade-info'
        ? newTaskVersion?.metadataCID || ''
        : task.metadataCID,
    metadata:
      accordionView === 'upgrade-info'
        ? newTaskVersionMetadata || undefined
        : metadata || undefined,
    details: accordionView === 'upgrade-info' ? newTaskVersionDetails : details,
    isRunning,
    isUpgradeInfo: accordionView === 'upgrade-info',
    onOpenAddTaskVariableModal: handleOpenAddTaskVariableModal,
    shouldDisplayToolsInUse: true,
    pendingRewards: accordionView === 'info' ? pendingRewards : undefined,
    shouldDisplayArchiveButton:
      accordionView === 'info' && !isRunning && !myStakeInKoii,
  };
  const retryAnimationClasses = `w-[25px] h-[25px]
    ${timeRemaining <= 0 && 'animate-spin'}`;
  const tooltipLeftPlacement: Placement = `${
    isFirstRowInTable ? 'bottom' : 'top'
  }-left`;
  const tooltipRightPlacement: Placement = `${
    isFirstRowInTable ? 'bottom' : 'top'
  }-right`;

  const optionsDropdown = (
    <div
      ref={optionsDropdownRef}
      className="relative flex flex-row items-center gap-4"
    >
      <Button
        onClick={handleToggleOptionsDropdown}
        onlyIcon
        icon={<Icon source={DotsSvg} className="text-white h-8 w-8" />}
        className={optionsButtonClasses}
      />
      {shouldDisplayActions && (
        <OptionsDropdown
          addStake={showAddStakeModal}
          unstake={showUnstakeModal}
          openLogs={openTaskLogs}
          runOrStopTask={handleToggleTask}
          task={task}
          isInverted={optionsDropdownIsInverted}
          onTaskArchive={handleTaskArchive}
        />
      )}
    </div>
  );

  if (upgradeStatus === UpgradeStatus.IN_PROGRESS)
    return (
      <TableRow
        columnsLayout={columnsLayout}
        className={containerClasses}
        ref={infoRef}
      >
        <UpgradeInProgressContent />
      </TableRow>
    );

  if (upgradeStatus === UpgradeStatus.SUCCESS)
    return (
      <TableRow
        columnsLayout={columnsLayout}
        className={containerClasses}
        ref={infoRef}
      >
        <UpgradeSucceededContent
          newTaskVersionName={newTaskVersion?.taskName || ''}
        />
      </TableRow>
    );

  if (upgradeStatus === UpgradeStatus.ERROR)
    return (
      <TableRow
        columnsLayout={columnsLayout}
        className={containerClasses}
        ref={infoRef}
      >
        <UpgradeFailedContent
          retryUpgrade={() =>
            setUpgradeStatus(UpgradeStatus.IS_CONFIRMING_UPGRADE)
          }
        />
      </TableRow>
    );

  return (
    <Tooltip
      groupName="task"
      tooltipContent={mainTooltipContent}
      placement={tooltipRightPlacement}
      forceHide={isMainTooltipHidden}
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
          ) : [
              UpgradeStatus.UPGRADE_AVAILABLE,
              UpgradeStatus.ACKNOWLEDGED,
              UpgradeStatus.IN_PROGRESS,
              UpgradeStatus.NEW_VERSION_BEING_AUDITED,
              UpgradeStatus.PRIVATE_UPGRADE_AVAILABLE,
            ].includes(upgradeStatus) ? (
            <Tooltip
              placement={tooltipRightPlacement}
              tooltipContent={
                [UpgradeStatus.IN_PROGRESS].includes(upgradeStatus)
                  ? 'Upgrade in progress'
                  : [UpgradeStatus.PRIVATE_UPGRADE_AVAILABLE].includes(
                      upgradeStatus
                    )
                  ? 'Running tasks that are not vetted by our team could be risky.'
                  : 'Upgrade available'
              }
            >
              <UpdateIcon
                className={updateIconClasses}
                onClick={handleClickOnUpdateIcon}
              />
            </Tooltip>
          ) : [
              UpgradeStatus.IS_CONFIRMING_UPGRADE,
              UpgradeStatus.PRIVATE_UPGRADE_WARNING,
            ].includes(upgradeStatus) ? (
            <button
              onClick={handleClickArrow}
              className="cursor-pointer h-12 w-12 flex justify-center items-center"
            >
              <ArrowIcon className="cursor-pointer" />
            </button>
          ) : hasOngoingRetry ? (
            <Tooltip
              tooltipContent="Click to retry now"
              placement={tooltipRightPlacement}
            >
              <button
                className="flex flex-col items-center justify-center cursor-pointer"
                onClick={handleToggleTask}
              >
                <RetryAnim className={retryAnimationClasses} />
                {Counter}
              </button>
            </Tooltip>
          ) : (
            <Tooltip
              tooltipContent={toggleTaskTooltipContent}
              placement={tooltipRightPlacement}
            >
              <Button
                onlyIcon
                icon={
                  <Icon
                    source={
                      isRunning && myStakeInKoii > 0 ? PauseFill : PlayFill
                    }
                    size={18}
                    className={toggleTaskButtonClasses}
                  />
                }
                onClick={handleToggleTask}
                className="w-8 h-8 rounded-full"
                disabled={isPlayPauseButtonDisabled}
              />
            </Tooltip>
          )}
        </div>
        {upgradeStatus === UpgradeStatus.PRIVATE_UPGRADE_WARNING ? (
          <PrivateUpgradeWarning
            onReview={handleToggleUpgradeInfoAccordion}
            onAcknowledge={handleAcknowledgeUpgrade}
            onUpgrade={handleMoveToConfirmUpgrade}
            isFirstRowInTable={isFirstRowInTable}
            isCoolingDown={isCoolingDown}
          />
        ) : (
          <>
            <div className="flex gap-3 justify-self-start">
              <Tooltip
                placement={tooltipRightPlacement}
                tooltipContent={infoButtonTooltipContent}
              >
                <div
                  {...propsManagingMainTooltipState}
                  className="flex flex-col items-center justify-start w-10"
                >
                  <Button
                    onClick={handleToggleInfoAccordion}
                    icon={
                      <Icon
                        source={InformationCircleLine}
                        size={36}
                        className={infoIconClasses}
                      />
                    }
                    onlyIcon
                  />
                </div>
              </Tooltip>
              <div className="flex flex-col gap-1 text-xs justify-self-start max-w-[12vw]">
                <div>{taskName}</div>
                <div className="text-finnieTeal truncate">
                  <span>ID:</span> <Address address={task.publicKey} />
                </div>
              </div>
            </div>
            {upgradeStatus === UpgradeStatus.NEW_VERSION_BEING_AUDITED ? (
              <>
                <NewVersionInAudit />
                {optionsDropdown}
              </>
            ) : upgradeStatus === UpgradeStatus.UPGRADE_AVAILABLE ||
              upgradeStatus === UpgradeStatus.PRIVATE_UPGRADE_AVAILABLE ? (
              <UpgradeAvailableContent
                onReview={handleToggleUpgradeInfoAccordion}
                onAcknowledge={handleAcknowledgeUpgrade}
                onUpgrade={
                  upgradeStatus === UpgradeStatus.PRIVATE_UPGRADE_AVAILABLE
                    ? handleMoveToPrivateUpgradeWarning
                    : handleMoveToConfirmUpgrade
                }
                isFirstRowInTable={isFirstRowInTable}
                isCoolingDown={isCoolingDown}
                isPrivateUpgrade={
                  upgradeStatus === UpgradeStatus.PRIVATE_UPGRADE_AVAILABLE
                }
              />
            ) : upgradeStatus === UpgradeStatus.IS_CONFIRMING_UPGRADE ? (
              <ConfirmUpgradeContent
                hasVariablesToUpgrade={upgradeUsesDifferentVariables}
                taskVariables={newTaskVersionVariables}
                openSettings={handleToggleSettingsAccordion}
                onUpgrade={upgradeTask}
                originalStake={taskStake}
                newStake={newTaskVersionStake}
                minStake={newTaskVersion?.minimumStakeAmount || 0}
                isLoadingNewVersion={isLoadingNewTaskVersion}
                isTaskSettingsValid={isTaskSettingsValid}
                isFirstRowInTable={isFirstRowInTable}
              />
            ) : (
              <>
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
                    tooltipPlacement={tooltipLeftPlacement}
                    roundTime={roundTime}
                  />
                </div>
                <div {...propsManagingMainTooltipState}>
                  {upgradeStatus === UpgradeStatus.ACKNOWLEDGED ? (
                    <Button
                      onClick={
                        newTaskVersion?.isWhitelisted
                          ? handleDisplayUpgradeAvailable
                          : handleDisplayPrivateUpgradeAvailable
                      }
                      icon={<UploadLine />}
                      onlyIcon
                      className="text-finnieBlue h-9 w-14 rounded bg-white flex justify-center items-center -mr-1 xl:mr-0"
                    />
                  ) : !hasOngoingRetry ? (
                    <Status
                      status={taskStatus}
                      isFirstRowInTable={isFirstRowInTable}
                      isLoading={isLoadingStatus}
                      isRunning={isRunning}
                    />
                  ) : (
                    <Tooltip
                      placement={tooltipLeftPlacement}
                      tooltipContent="We'll keep retrying this task until it works.
                  If you want to stop, click the x at anytime."
                    >
                      <button
                        onClick={handleCancelTaskRetry}
                        className="cursor-pointer"
                      >
                        <CancelButton />
                      </button>
                    </Tooltip>
                  )}
                </div>
                {optionsDropdown}
              </>
            )}
          </>
        )}

        <div className={accordionClasses}>
          <div ref={parent} className="flex w-full">
            {isAccordionOpen &&
              (isLoadingAccordionInfo ? (
                <div className="m-auto">
                  <LoadingSpinner />
                </div>
              ) : accordionView === 'upgrade-settings' ? (
                <TaskSettings
                  taskPubKey={newTaskVersion?.publicKey || ''}
                  onToolsValidation={handleTaskToolsValidationCheck}
                  taskVariables={newTaskVersionVariables}
                  onPairingSuccess={closeAccordionView}
                  onOpenAddTaskVariableModal={handleOpenAddTaskVariableModal}
                  moveToTaskInfo={() => setAccordionView('upgrade-info')}
                />
              ) : (
                <TaskInfo {...taskInfoProps} />
              ))}
          </div>
        </div>
      </TableRow>
    </Tooltip>
  );
}
