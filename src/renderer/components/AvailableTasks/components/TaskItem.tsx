import {
  CloseLine,
  Icon,
  PlayFill,
  InformationCircleLine,
  PauseFill,
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
  ReactNode,
  RefObject,
} from 'react';
import toast, { Toaster } from 'react-hot-toast';
import { useQueryClient } from 'react-query';

import GearFill from 'assets/svgs/gear-fill.svg';
import GearLine from 'assets/svgs/gear-line.svg';
import { RequirementTag, RequirementType } from 'models';
import { RoundTime } from 'renderer/components/RoundTime';
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
  useAddTaskVariableModal,
  useStartingTasksContext,
} from 'renderer/features';
import { TaskService, stopTask } from 'renderer/services';
import { Task } from 'renderer/types';
import { getCreatedAtDate, getKoiiFromRoe } from 'utils';

import { SuccessMessage } from './SuccessMessage';
import { TaskInfo } from './TaskInfo';
import { TaskSettings } from './TaskSettings';

interface Props {
  task: Task;
  index: number;
  columnsLayout: ColumnsLayout;
}

function TaskItem({ task, index, columnsLayout }: Props) {
  const [isAddTaskSettingModalOpen, setIsAddTaskSettingModalOpen] =
    useState<boolean>(false);
  const { showModal: showAddTaskVariableModal } = useAddTaskVariableModal();
  const { taskName, publicKey, taskManager, isRunning, roundTime } = task;
  const queryCache = useQueryClient();
  const [accordionView, setAccordionView] = useState<
    'info' | 'settings' | null
  >(null);
  const [isGlobalToolsValid, setIsGlobalToolsValid] = useState(false);
  const [isTaskToolsValid, setIsTaskToolsValid] = useState(false);
  const [isTaskValidToRun, setIsTaskValidToRun] = useState(false);
  const [taskStartSucceeded, setTaskStartSucceeded] = useState(false);
  const [valueToStake, setValueToStake] = useState<number>(0);
  const [meetsMinimumStake, setMeetsMinimumStake] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string | ReactNode>('');
  const { executeTask, getTaskStartPromise, getIsTaskLoading } =
    useStartingTasksContext();

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

  const closeAccordionView = useCallback(() => {
    if (isAddTaskSettingModalOpen) {
      return;
    }
    setAccordionView(null);
  }, [isAddTaskSettingModalOpen]);

  useOnClickOutside(
    ref as MutableRefObject<HTMLDivElement>,
    closeAccordionView
  );

  const { taskStake: alreadyStakedTokensAmount, loadingTaskStake } =
    useTaskStake({
      task,
      publicKey: mainAccountPubKey,
      enabled: !!mainAccountPubKey,
    });

  const handleToggleView = useCallback(
    (view: 'info' | 'settings') => {
      const newView = accordionView === view ? null : view;
      setAccordionView(newView);
    },
    [accordionView]
  );

  const handleTaskToolsValidationCheck = (isValid: boolean) => {
    setIsTaskToolsValid(isValid);
  };

  const minStake = task.minimumStakeAmount;
  const isFirstRowInTable = index === 0;
  const nodes = useMemo(() => TaskService.getNodesCount(task), [task]);
  const topStake = useMemo(() => TaskService.getTopStake(task), [task]);
  const totalBountyInKoii = useMemo(
    () => getKoiiFromRoe(task.totalBountyAmount),
    [task.totalBountyAmount]
  );
  const isEditStakeInputDisabled =
    alreadyStakedTokensAmount !== 0 || loadingTaskStake;
  const details = useMemo(
    () => ({
      nodes,
      minStake: getKoiiFromRoe(minStake),
      topStake: getKoiiFromRoe(topStake),
      bounty: totalBountyInKoii,
    }),
    [nodes, minStake, topStake, totalBountyInKoii]
  );

  const { metadata, isLoadingMetadata } = useMetadata(task.metadataCID);

  const globalAndTaskVariables: RequirementTag[] = useMemo(
    () =>
      metadata?.requirementsTags?.filter(({ type }) =>
        [
          RequirementType.TASK_VARIABLE,
          RequirementType.GLOBAL_VARIABLE,
        ].includes(type)
      ) || [],
    [metadata?.requirementsTags]
  );

  useEffect(() => {
    getTaskStartPromise(publicKey)
      ?.then(() => {
        setTaskStartSucceeded(true);
      })
      .catch(() => {
        setTaskStartSucceeded(false);
        toast.error(`Task ${taskName} running failed. Please try again!`, {
          duration: 1500,
          icon: <CloseLine className="h-5 w-5" />,
          style: {
            backgroundColor: '#FFA6A6',
            paddingRight: 0,
          },
        });
      });
  }, [getTaskStartPromise, publicKey, task.publicKey, taskName]);

  useEffect(() => {
    const validateAllVariablesWerePaired = () => {
      const numberOfPairedVariables = Object.keys(pairedVariables || {}).length;

      const allVariablesWerePaired =
        (globalAndTaskVariables?.length || 0) === numberOfPairedVariables;
      setIsGlobalToolsValid(allVariablesWerePaired);
      setIsTaskToolsValid(allVariablesWerePaired);
    };

    validateAllVariablesWerePaired();
  }, [pairedVariables, globalAndTaskVariables]);

  const validateTask = useCallback(() => {
    const hasEnoughKoii =
      accountBalance > minStake && accountBalance > valueToStake;
    const hasMinimumStake =
      (alreadyStakedTokensAmount || valueToStake) >= minStake;
    const isTaskValid = hasMinimumStake && isTaskToolsValid && hasEnoughKoii;
    setIsTaskValidToRun(isTaskValid);

    const getErrorMessage = () => {
      if (isRunning) return '';

      const conditions = [
        { condition: hasEnoughKoii, errorMessage: 'have enough KOII to stake' },
        {
          condition: hasMinimumStake,
          errorMessage: `stake at least ${getKoiiFromRoe(
            minStake
          )} KOII on this Task`,
        },
        {
          condition: isTaskToolsValid,
          errorMessage: 'configure the Task settings',
        },
      ];

      const errors = conditions
        .filter(({ condition }) => !condition)
        .map(({ errorMessage }) => errorMessage);

      if (errors.length === 0) {
        return '';
      } else if (errors.length === 1) {
        return `Make sure you ${errors[0]}.`;
      } else {
        const errorList = errors.map((error) => <li key={error}>• {error}</li>);
        return (
          <div>
            Make sure you:
            <br />
            <ul> {errorList}</ul>
          </div>
        );
      }
    };

    const errorMessage = getErrorMessage();
    setErrorMessage(errorMessage);
  }, [
    isRunning,
    isTaskToolsValid,
    minStake,
    valueToStake,
    accountBalance,
    alreadyStakedTokensAmount,
  ]);

  useEffect(() => {
    validateTask();
  }, [validateTask]);

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

  const handleOpenAddTaskVariableModal = useCallback(
    (dropdownRef: RefObject<HTMLButtonElement>, tool: string) => {
      setIsAddTaskSettingModalOpen((prev) => !prev);
      showAddTaskVariableModal(tool).then((wasVariableAdded) => {
        setIsAddTaskSettingModalOpen(false);
        // focus dropdown after creating new variable
        if (wasVariableAdded) {
          setTimeout(() => {
            dropdownRef?.current?.click();
          }, 100);
        }
      });
    },
    [showAddTaskVariableModal]
  );

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
          publicKey={task.publicKey}
          metadata={metadata}
          details={details}
        />
      );
    }

    if (accordionView === 'settings') {
      return (
        <TaskSettings
          taskPubKey={task.publicKey}
          onToolsValidation={handleTaskToolsValidationCheck}
          taskVariables={globalAndTaskVariables}
          onPairingSuccess={closeAccordionView}
          onOpenAddTaskVariableModal={handleOpenAddTaskVariableModal}
          moveToTaskInfo={() => handleToggleView('info')}
        />
      );
    }

    return null;
  }, [
    accordionView,
    isLoadingMetadata,
    task.publicKey,
    metadata,
    details,
    globalAndTaskVariables,
    closeAccordionView,
    handleOpenAddTaskVariableModal,
    handleToggleView,
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
  const runButtonTooltipContent =
    errorMessage || (isRunning ? 'Stop task' : 'Start task');

  return taskStartSucceeded ? (
    <SuccessMessage />
  ) : (
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

      <div className="flex flex-col gap-2 text-xs justify-self-start">
        <div>{taskName}</div>
        <div className="text-finnieTeal">{createdAt}</div>
      </div>

      <div
        className="flex flex-col gap-2 text-xs min-w-[160px] w-full justify-self-start"
        title={taskManager}
      >
        <div className="truncate">{`Creator: ${task.taskManager}`}</div>
        <div className="truncate">{`Bounty: ${totalBountyInKoii}`}</div>
      </div>

      <div
        className="flex flex-col gap-2 overflow-hidden text-xs"
        title={taskManager}
      >
        <div>{`Nodes: ${nodes}`}</div>
        <div>{`Top Stake: ${getKoiiFromRoe(topStake)}`}</div>
      </div>

      <RoundTime
        tooltipPlacement={`${isFirstRowInTable ? 'bottom' : 'top'}-right`}
        roundTime={roundTime}
      />

      <EditStakeInput
        meetsMinimumStake={meetsMinimumStake}
        stake={alreadyStakedTokensAmount || valueToStake}
        minStake={minStake as number}
        onChange={handleStakeValueChange}
        disabled={isEditStakeInputDisabled}
      />

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

      {getIsTaskLoading(publicKey) ? (
        <div className="py-[0.72rem]">
          <LoadingSpinner size={LoadingSpinnerSize.Large} />
        </div>
      ) : (
        <Tooltip
          placement={`${isFirstRowInTable ? 'bottom' : 'top'}-left`}
          tooltipContent={runButtonTooltipContent}
        >
          <Button
            onlyIcon
            icon={
              <Icon
                source={isRunning ? PauseFill : PlayFill}
                size={18}
                className={`w-full flex my-4 ${
                  isTaskValidToRun || isRunning
                    ? 'text-finnieTeal'
                    : 'text-gray-500 cursor-not-allowed'
                }`}
              />
            }
            onClick={
              isRunning
                ? handleStopTask
                : () =>
                    executeTask({
                      publicKey,
                      valueToStake,
                      alreadyStakedTokensAmount,
                    })
            }
            disabled={!isRunning && !isTaskValidToRun}
          />
        </Tooltip>
      )}

      <div
        className={`w-full col-span-9 overflow-y-auto overflow-x-hidden inner-scrollbar ${
          accordionView !== null
            ? // 4000px is just a simbolic value of a ridiculously high height, the animation needs absolute max-h values to work properly (fit/max/etc won't work)
              'opacity-1 pt-6 max-h-[4000px]'
            : 'opacity-0 max-h-0'
        } transition-all duration-500 ease-in-out`}
      >
        <div ref={parent} className="flex w-full">
          {getTaskDetailsComponent()}
        </div>
      </div>
      <Toaster />
    </TableRow>
  );
}

export default memo(TaskItem);
