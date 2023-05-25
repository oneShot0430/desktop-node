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
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import { toast } from 'react-hot-toast';
import { useQuery, useQueryClient } from 'react-query';

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
import { useStakingAccount } from 'renderer/features';
import {
  useAddStakeModal,
  useUnstakeModal,
  useTaskStake,
  useMetadata,
  useOnClickOutside,
  useTaskStatus,
} from 'renderer/features/common';
import {
  stopTask,
  startTask,
  TaskService,
  QueryKeys,
  getTaskPairedVariablesNamesWithLabels,
  getRewardEarned,
  openLogfileFolder,
  getActiveAccountName,
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
};

export function TaskItem({
  task,
  accountPublicKey,
  index,
  columnsLayout,
  totalItems,
}: PropsType) {
  const [shouldDisplayInfo, setShouldDisplayInfo] = useState(false);
  const [shouldDisplayActions, setShouldDisplayActions] = useState(false);
  const [loading, setLoading] = useState(false);
  const [earnedReward, setEarnedReward] = useState(0);

  const { taskName, isRunning, publicKey, roundTime } = task;

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

  useEffect(() => {
    getRewardEarned(task).then((reward) => {
      setEarnedReward(reward);
    });
  });

  const { data: stakingAccountPublicKey = '' } = useStakingAccount();
  const { taskStatus, isLoadingStatus } = useTaskStatus({
    task,
    stakingAccountPublicKey,
  });

  const earnedRewardInKoii = getKoiiFromRoe(earnedReward);
  const myStakeInKoii = getKoiiFromRoe(taskStake);
  const totalBountyInKoii = getKoiiFromRoe(task.totalBountyAmount);
  const isFirstRowInTable = index === 0;
  const optionsDropdownIsInverted = totalItems > 5 && index > totalItems - 3;

  const nodes = useMemo(() => TaskService.getNodesCount(task), [task]);
  const topStake = useMemo(() => TaskService.getTopStake(task), [task]);

  const { metadata, isLoadingMetadata } = useMetadata(task.metadataCID);

  const { data: pairedVariables, isLoading: isLoadingPairedVariables } =
    useQuery(QueryKeys.StoredTaskPairedTaskVariables, () =>
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

  const createdAt = useMemo(
    () => getCreatedAtDate(metadata?.createdAt),
    [metadata]
  );

  const [parent] = useAutoAnimate();

  const infoRef = useRef<HTMLDivElement>(null);
  const optionsDropdownRef = useRef<HTMLDivElement>(null);

  const closeAccordionView = () => setShouldDisplayInfo(false);
  const closeOptionsDropdown = () => setShouldDisplayActions(false);
  const openTaskLogs = async () => {
    const openedTheLogs: boolean = await openLogfileFolder(task.publicKey);
    if (!openedTheLogs) {
      toast.error('Unable to open the logs folder. Try Again', {
        icon: <CloseLine className="h-5 w-5" />,
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
  const taskIsDelistedAndStopped = !task.isWhitelisted && !isRunning;
  const isPlayPauseButtonDisabled =
    !(myStakeInKoii > 0) || taskIsDelistedAndStopped;

  const containerClasses = `py-2.5 gap-y-0 ${
    taskStatus === TaskStatus.FLAGGED
      ? 'bg-[#FF4141]/25'
      : [TaskStatus.ERROR, TaskStatus.BLACKLISTED].includes(taskStatus)
      ? 'bg-[#FF4141]/20'
      : !isRunning
      ? 'bg-[#FFA54B]/25'
      : ''
  }`;
  const tooltipContent = taskIsDelistedAndStopped
    ? "This task has been delisted, but don't worry! Your tokens are safe and will be ready to unstake after 3 rounds."
    : !task.isWhitelisted
    ? "This task has been delisted, but don't worry! Your tokens are safe. Pause the task and the tokens will be ready to unstake after 3 rounds."
    : myStakeInKoii > 0
    ? `${isRunning ? 'Stop' : 'Start'} task`
    : `You need to stake at least ${minStake} KOII on this task to run it.`;

  return (
    <TableRow
      columnsLayout={columnsLayout}
      className={containerClasses}
      ref={infoRef}
    >
      <div>
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
                  source={isRunning && myStakeInKoii > 0 ? PauseFill : PlayFill}
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
              className="rounded-full w-8 h-8"
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
          <div className="flex flex-col items-center justify-start w-10">
            <Button
              onClick={() =>
                setShouldDisplayInfo((shouldDisplayInfo) => !shouldDisplayInfo)
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
        <div className="text-xs flex flex-col gap-1 justify-self-start">
          <div>{taskName}</div>
          <div className="text-finnieTeal">{createdAt}</div>
        </div>
      </div>
      <div className="flex flex-col gap-2 text-xs min-w-[130px] w-full justify-self-start">
        <div className="truncate">{`Creator: ${task.taskManager}`}</div>
        <div className="truncate">{`Account: ${accountName}`}</div>
      </div>
      <div className="flex flex-col gap-2 text-xs min-w-[50px] w-fit text-left mr-auto ml-[20%] xl:ml-[40%] 2xl:ml-[50%]">
        <div className="truncate">{`Staked: ${myStakeInKoii}`}</div>
        <div className="truncate">{`Bounty: ${totalBountyInKoii}`}</div>
      </div>
      <div className="flex flex-col gap-2 text-xs w-fit">
        <div className="truncate">All time: soon</div>
        <div className="truncate">{`To claim: ${earnedRewardInKoii}`}</div>
      </div>
      <RoundTime
        tooltipPlacement={`${isFirstRowInTable ? 'bottom' : 'top'}-right`}
        roundTime={roundTime}
      />
      <div>
        <Status
          status={taskStatus}
          isFirstRowInTable={isFirstRowInTable}
          isLoading={isLoadingStatus}
          isRunning={isRunning}
        />
      </div>
      <div
        ref={optionsDropdownRef}
        className="flex flex-row items-center gap-4 relative"
      >
        <Button
          onClick={() =>
            setShouldDisplayActions(
              (shouldDisplayActions) => !shouldDisplayActions
            )
          }
          onlyIcon
          icon={<Icon source={ClickXlLine} className="text-white h-10 w-10" />}
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
        className={`w-full col-span-9 overflow-y-auto ${
          shouldDisplayInfo
            ? 'opacity-1 pt-6 max-h-[360px]'
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
              metadata={metadata}
              details={details}
              shouldDisplayToolsInUse
            />
          )}
        </div>
      </div>
    </TableRow>
  );
}
