import {
  CloseLine,
  Icon,
  PlayFill,
  InformationCircleLine,
} from '@_koii/koii-styleguide';
import { useAutoAnimate } from '@formkit/auto-animate/react';
import React, {
  memo,
  useState,
  useCallback,
  useMemo,
  useEffect,
  useRef,
  MutableRefObject,
} from 'react';
import { useQuery, useQueryClient } from 'react-query';

import GearFill from 'assets/svgs/gear-fill.svg';
import GearLine from 'assets/svgs/gear-line.svg';
import PlayIcon from 'assets/svgs/play-icon.svg';
import StopTealIcon from 'assets/svgs/stop-icon-teal.svg';
import { RequirementType } from 'models';
import {
  Button,
  LoadingSpinner,
  LoadingSpinnerSize,
  Tooltip,
  TableRow,
  ColumnsLayout,
  EditStakeInput,
} from 'renderer/components/ui';
import {
  useMainAccount,
  useTaskStake,
  useOnClickOutside,
  useAccountBalance,
  useMetadata,
  useAllStoredPairedTaskVariables,
} from 'renderer/features';
import {
  QueryKeys,
  TaskService,
  stopTask,
  stakeOnTask,
  startTask,
} from 'renderer/services';
import { Task } from 'renderer/types';
import { getCreatedAtDate, getKoiiFromRoe } from 'utils';

import { TaskInfo } from './TaskInfo';
import { TaskSettings } from './TaskSettings';

interface Props {
  task: Task;
  index: number;
  columnsLayout: ColumnsLayout;
}

function TaskItem({ task, index, columnsLayout }: Props) {
  const { taskName, publicKey, taskManager, isRunning } = task;
  const queryCache = useQueryClient();
  const [accordionView, setAccordionView] = useState<
    'info' | 'settings' | null
  >(null);
  const [isGlobalToolsValid, setIsGlobalToolsValid] = useState(false);
  const [isTaskToolsValid, setIsTaskToolsValid] = useState(false);
  const [isTaskValidToRun, setIsTaskValidToRun] = useState(false);
  const [valueToStake, setValueToStake] = useState<number>(0);
  const [meetsMinimumStake, setMeetsMinimumStake] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);

  const { data: mainAccountPubKey = '' } = useMainAccount();

  const { accountBalance = 0 } = useAccountBalance(mainAccountPubKey);

  const {
    storedPairedTaskVariablesQuery: { data: allPairedVariables = {} },
  } = useAllStoredPairedTaskVariables({
    enabled: !!publicKey,
  });

  const pairedVariables = Object.entries(allPairedVariables).filter(
    ([taskId]) => taskId === publicKey
  )[0]?.[1];

  const ref = useRef<HTMLDivElement>(null);

  const [parent] = useAutoAnimate();

  useOnClickOutside(
    ref as MutableRefObject<HTMLDivElement>,
    useCallback(() => setAccordionView(null), [])
  );

  const { taskStake: alreadyStakedTokensAmount, loadingTaskStake } =
    useTaskStake({
      task,
      publicKey: mainAccountPubKey,
      enabled: !!mainAccountPubKey,
    });

  const handleToggleView = (view: 'info' | 'settings') => {
    const newView = accordionView === view ? null : view;
    setAccordionView(newView);
  };

  const handleGlobalToolsValidationCheck = (isValid: boolean) => {
    setIsGlobalToolsValid(isValid);
  };

  const handleTaskToolsValidationCheck = (isValid: boolean) => {
    setIsTaskToolsValid(isValid);
  };

  const isFirstRowInTable = index === 0;
  const nodes = useMemo(() => TaskService.getNodesCount(task), [task]);
  const topStake = useMemo(() => TaskService.getTopStake(task), [task]);
  const bountyPerRoundInKoii = useMemo(
    () => getKoiiFromRoe(task.totalBountyAmount),
    [task.totalBountyAmount]
  );

  const { data: minStake = 0 } = useQuery([QueryKeys.minStake, publicKey], () =>
    TaskService.getMinStake(task)
  );

  const { metadata, isLoadingMetadata } = useMetadata(task.metadataCID);

  const globalAndTaskVariables = metadata?.requirementsTags?.filter(
    ({ type }) =>
      [RequirementType.TASK_VARIABLE, RequirementType.GLOBAL_VARIABLE].includes(
        type
      )
  );

  useEffect(() => {
    const validateAllVariablesWerePaired = () => {
      const numberOfPairedVariables = Object.keys(pairedVariables || {}).length;

      const allVariablesWerePaired =
        globalAndTaskVariables?.length === numberOfPairedVariables;
      setIsGlobalToolsValid(allVariablesWerePaired);
      setIsTaskToolsValid(allVariablesWerePaired);
    };

    validateAllVariablesWerePaired();
  }, [pairedVariables, globalAndTaskVariables]);

  const validateTask = useCallback(() => {
    const hasEnoughKoii = accountBalance > valueToStake;
    const hasMinimumStake =
      (alreadyStakedTokensAmount || valueToStake) >= minStake;
    const isTaskValid = hasMinimumStake && isTaskToolsValid && hasEnoughKoii;
    setIsTaskValidToRun(isTaskValid);
  }, [
    isTaskToolsValid,
    minStake,
    valueToStake,
    accountBalance,
    alreadyStakedTokensAmount,
  ]);

  useEffect(() => {
    validateTask();
  }, [validateTask]);

  const handleStartTask = async () => {
    try {
      setLoading(true);
      if (alreadyStakedTokensAmount === 0) {
        await stakeOnTask(publicKey, valueToStake);
      }
      await startTask(publicKey);
    } catch (error) {
      console.error(error);
    } finally {
      queryCache.invalidateQueries();
      setLoading(false);
    }
  };

  const handleStopTask = async () => {
    try {
      await stopTask(publicKey);
    } catch (error) {
      console.error(error);
    } finally {
      queryCache.invalidateQueries();
    }
  };

  const handleStakeValueChange = (value: number) => {
    setValueToStake(value);
    setMeetsMinimumStake(value >= minStake);
  };

  const getTaskPlayButtonIcon = useCallback(() => {
    if (isRunning) {
      return <StopTealIcon />;
    }

    return isTaskValidToRun ? (
      <PlayIcon className="-ml-4" />
    ) : (
      <Icon
        source={PlayFill}
        size={18}
        className="cursor-not-allowed text-gray my-4"
      />
    );
  }, [isRunning, isTaskValidToRun]);

  const getTaskDetailsComponent = useCallback(() => {
    if (
      (accordionView === 'info' || accordionView === 'settings') &&
      isLoadingMetadata
    ) {
      return <LoadingSpinner />;
    }

    if (accordionView === 'info') {
      return (
        <TaskInfo
          taskPubKey={task.publicKey}
          info={metadata}
          onToolsValidation={handleGlobalToolsValidationCheck}
        />
      );
    }

    if (accordionView === 'settings') {
      return (
        <TaskSettings
          taskPubKey={task.publicKey}
          onToolsValidation={handleTaskToolsValidationCheck}
          taskVariables={globalAndTaskVariables}
        />
      );
    }

    return null;
  }, [
    accordionView,
    task,
    metadata,
    globalAndTaskVariables,
    isLoadingMetadata,
  ]);

  const createdAt = useMemo(
    () => getCreatedAtDate(metadata?.createdAt),
    [metadata]
  );
  const GearIcon = globalAndTaskVariables?.length ? GearFill : GearLine;
  const gearIconColor = isTaskToolsValid
    ? 'text-finnieEmerald-light'
    : 'text-finnieOrange';
  const gearTooltipContent = !globalAndTaskVariables?.length
    ? "This Task doesn't use any Task settings"
    : isTaskToolsValid
    ? 'Open Task settings'
    : 'You need to set up the Task settings first in order to run this Task.';

  return (
    <TableRow columnsLayout={columnsLayout} className="py-2 gap-y-0" ref={ref}>
      <div>
        <Tooltip
          placement={`${isFirstRowInTable ? 'bottom' : 'top'}-right`}
          tooltipContent="Open task details"
        >
          <div className="flex flex-col items-center justify-start w-10">
            <Button
              onClick={() => handleToggleView('info')}
              icon={
                <Icon
                  source={
                    accordionView === 'info' ? CloseLine : InformationCircleLine
                  }
                  size={36}
                />
              }
              onlyIcon
            />
          </div>
        </Tooltip>
      </div>

      <div className="flex flex-col gap-2 text-xs">
        <div>{taskName}</div>
        <div className="text-finnieTeal">{createdAt}</div>
      </div>

      <div
        className="flex flex-col gap-2 text-xs min-w-[160px]"
        title={taskManager}
      >
        <div className="truncate">{`Creator: ${task.taskName}`}</div>
        <div className="truncate">{`Bounty: ${bountyPerRoundInKoii}`}</div>
      </div>

      <div
        className="flex flex-col gap-2 pr-8 overflow-hidden text-xs"
        title={taskManager}
      >
        <div>{`Nodes: ${nodes}`}</div>
        <div>{`Top Stake: ${getKoiiFromRoe(topStake)}`}</div>
      </div>

      <div>
        <EditStakeInput
          meetsMinimumStake={meetsMinimumStake}
          stake={alreadyStakedTokensAmount || valueToStake}
          minStake={minStake as number}
          onChange={handleStakeValueChange}
          disabled={alreadyStakedTokensAmount !== 0 || loadingTaskStake}
        />
      </div>

      <div>
        <div>
          <Tooltip
            placement={`${isFirstRowInTable ? 'bottom' : 'top'}-left`}
            tooltipContent={gearTooltipContent}
          >
            <div className="flex flex-col items-center justify-start w-10">
              <Button
                onMouseDown={() => handleToggleView('settings')}
                disabled={!globalAndTaskVariables?.length}
                icon={
                  <Icon source={GearIcon} size={36} className={gearIconColor} />
                }
                onlyIcon
              />
            </div>
          </Tooltip>
        </div>
      </div>

      <div>
        {loading ? (
          <div className="pl-2">
            <LoadingSpinner size={LoadingSpinnerSize.Large} />
          </div>
        ) : (
          <Tooltip
            placement={`${isFirstRowInTable ? 'bottom' : 'top'}-left`}
            tooltipContent={`${isRunning ? 'Stop' : 'Start'} task`}
          >
            <Button
              onlyIcon
              icon={getTaskPlayButtonIcon()}
              onClick={isRunning ? handleStopTask : handleStartTask}
              disabled={!isTaskValidToRun}
            />
          </Tooltip>
        )}
      </div>

      <div
        className={`w-full col-span-7 max-h-[360px] overflow-y-auto ${
          accordionView !== null ? 'opacity-1 pt-6' : 'opacity-0'
        } transition-all duration-500 ease-in-out`}
      >
        <div ref={parent} className="flex w-full">
          {getTaskDetailsComponent()}
        </div>
      </div>
    </TableRow>
  );
}

export default memo(TaskItem);
