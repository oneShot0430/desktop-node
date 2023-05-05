import {
  PauseFill,
  PlayFill,
  CurrencyMoneyLine,
  Icon,
  CloseLine,
  InformationCircleLine,
} from '@_koii/koii-styleguide';
import { useAutoAnimate } from '@formkit/auto-animate/react';
import React, {
  MutableRefObject,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
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
  useEditStakeAmountModal,
  useTaskStake,
  useMetadata,
  useOnClickOutside,
} from 'renderer/features/common';
import {
  stopTask,
  startTask,
  TaskService,
  QueryKeys,
  getTaskPairedVariablesNamesWithLabels,
  getRewardEarned,
} from 'renderer/services';
import { Task } from 'renderer/types';
import { getCreatedAtDate, getKoiiFromRoe } from 'utils';

type PropsType = {
  task: Task;
  accountPublicKey: string;
  index: number;
  columnsLayout: ColumnsLayout;
};

export function TaskItem({
  task,
  accountPublicKey,
  index,
  columnsLayout,
}: PropsType) {
  const [shouldDisplayInfo, setShouldDisplayInfo] = useState(false);
  const [earnedReward, setEarnedReward] = useState(0);
  const [loading, setLoading] = useState(false);
  const { taskName, taskManager, isRunning, publicKey, roundTime } = task;
  const { taskStake, refetchTaskStake } = useTaskStake({
    task,
    publicKey: accountPublicKey,
  });
  const { showModal: showEditStakeAmountModal } = useEditStakeAmountModal({
    task,
    onStakeActionSuccess: refetchTaskStake,
  });
  const queryCache = useQueryClient();

  useEffect(() => {
    getRewardEarned(task).then((reward) => {
      setEarnedReward(reward);
    });
  });

  const { data: stakingAccountPublicKey = '' } = useStakingAccount();

  const earnedRewardInKoii = getKoiiFromRoe(earnedReward);
  const myStakeInKoii = getKoiiFromRoe(taskStake);
  const isFirstRowInTable = index === 0;
  const nodeStatus = useMemo(
    () => TaskService.getStatus(task, stakingAccountPublicKey),
    [task, stakingAccountPublicKey]
  );

  const { metadata, isLoadingMetadata } = useMetadata(task.metadataCID);

  const { data: pairedVariables, isLoading: isLoadingPairedVariables } =
    useQuery(QueryKeys.StoredTaskPairedTaskVariables, () =>
      getTaskPairedVariablesNamesWithLabels(task.publicKey)
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

  const ref = useRef<HTMLDivElement>(null);

  const [parent] = useAutoAnimate();

  const closeAccordionView = () => setShouldDisplayInfo(false);

  useOnClickOutside(
    ref as MutableRefObject<HTMLDivElement>,
    closeAccordionView
  );

  const minStake = getKoiiFromRoe(task.minimumStakeAmount);

  const tooltipContent =
    myStakeInKoii > 0
      ? `${isRunning ? 'Stop' : 'Start'} task`
      : `You need to stake at least ${minStake} KOII on this task to run it.`;
  return (
    <TableRow
      columnsLayout={columnsLayout}
      className={`py-2.5 gap-y-0 ${!isRunning ? 'bg-[#FFEE81]/20' : ''}`}
      ref={ref}
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
                  ${!(myStakeInKoii > 0) && 'opacity-60'}`}
                />
              }
              onClick={handleToggleTask}
              className="rounded-full w-8 h-8"
              disabled={!(myStakeInKoii > 0)}
            />
          </Tooltip>
        )}
      </div>
      <div>
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
                  source={shouldDisplayInfo ? CloseLine : InformationCircleLine}
                  size={36}
                />
              }
              onlyIcon
            />
          </div>
        </Tooltip>
      </div>

      <div className="text-xs flex flex-col gap-1 justify-self-start ">
        <div>{taskName}</div>
        <div className="text-finnieTeal">{createdAt}</div>
      </div>
      <div
        className="overflow-hidden text-ellipsis w-full justify-self-start"
        title={taskManager}
      >
        {taskManager}
      </div>
      <div>{earnedRewardInKoii}</div>
      <div>{myStakeInKoii}</div>
      <RoundTime
        tooltipPlacement={`${isFirstRowInTable ? 'bottom' : 'top'}-right`}
        roundTime={roundTime}
      />
      <div>
        <Status status={nodeStatus} isFirstRowInTable={isFirstRowInTable} />
      </div>
      <div className="flex flex-row items-center gap-4">
        <Tooltip
          placement={`${isFirstRowInTable ? 'bottom' : 'top'}-left`}
          tooltipContent="Edit stake amount"
        >
          <Button
            onClick={showEditStakeAmountModal}
            onlyIcon
            icon={
              <Icon
                source={CurrencyMoneyLine}
                className="text-white h-10 w-10"
              />
            }
            className="py-0.75 !pr-[0.5px] rounded-full"
          />
        </Tooltip>
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
              info={metadata}
              shouldDisplayToolsInUse
            />
          )}
        </div>
      </div>
    </TableRow>
  );
}
