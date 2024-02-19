import {
  CloseLine,
  Icon,
  PlayFill,
  InformationCircleLine,
  PauseFill,
} from '@_koii/koii-styleguide';
import { trackEvent } from '@aptabase/electron/renderer';
import { useAutoAnimate } from '@formkit/auto-animate/react';
import React, {
  memo,
  useState,
  useCallback,
  useMemo,
  useEffect,
  useRef,
  ReactNode,
  RefObject,
  MutableRefObject,
} from 'react';
import { useQuery, useQueryClient } from 'react-query';
import { twMerge } from 'tailwind-merge';

import GearFill from 'assets/svgs/gear-fill.svg';
import GearLine from 'assets/svgs/gear-line.svg';
import { CRITICAL_MAIN_ACCOUNT_BALANCE } from 'config/node';
import { RequirementTag, RequirementType } from 'models';
import {
  Button,
  LoadingSpinner,
  LoadingSpinnerSize,
  TableRow,
  ColumnsLayout,
  EditStakeInput,
} from 'renderer/components/ui';
import { DROPDOWN_MENU_ID } from 'renderer/components/ui/Dropdown/Dropdown';
import { Popover } from 'renderer/components/ui/Popover/Popover';
import {
  useMainAccount,
  useTaskStake,
  useAccountBalance,
  useMetadata,
  useAllStoredPairedTaskVariables,
  useAddTaskVariableModal,
  useStartingTasksContext,
  useOnClickOutside,
  useStakingAccount,
  useOrcaPodman,
  useConfirmRunTask,
} from 'renderer/features';
import { useAutoPairVariables } from 'renderer/features/common/hooks/useAutoPairVariables';
import {
  TaskService,
  stopTask,
  QueryKeys,
  getLatestAverageTaskReward,
} from 'renderer/services';
import { Task } from 'renderer/types';
import { Theme } from 'renderer/types/common';
import { getKoiiFromRoe } from 'utils';

import { formatNumber, getTaskTotalStake, isOrcaTask } from '../../utils';
import { SuccessMessage } from '../AvailableTasksTable/components/SuccessMessage';
import { TaskName } from '../common';
import { RoundTime } from '../common/RoundTime';
import { TaskItemStatCell } from '../common/TaskItemStatCell';
import { CurrencyDisplay } from '../MyNodeTaskRow/components/CurrencyDisplay';
import { TaskInfo } from '../TaskInfo';
import { TaskSettings } from '../TaskSettings';

import { FailedMessage } from './components/FailedMessage';

interface Props {
  task: Task;
  index: number;
  columnsLayout: ColumnsLayout;
}

function AvailableTaskRow({ task, index, columnsLayout }: Props) {
  const [isAddTaskSettingModalOpen, setIsAddTaskSettingModalOpen] =
    useState<boolean>(false);
  const { showModal: showAddTaskVariableModal } = useAddTaskVariableModal();
  const { taskName, publicKey, taskManager, isRunning, roundTime } = task;
  const queryCache = useQueryClient();
  const [accordionView, setAccordionView] = useState<
    'info' | 'settings' | null
  >(null);
  // const [isGlobalToolsValid, setIsGlobalToolsValid] = useState(false);
  const [isTaskToolsValid, setIsTaskToolsValid] = useState(false);
  const [isTaskValidToRun, setIsTaskValidToRun] = useState(false);
  const [taskStartSucceeded, setTaskStartSucceeded] = useState(false);
  const [taskStartFailed, setTaskStartFailed] = useState(false);
  const [valueToStake, setValueToStake] = useState<number>(
    task.minimumStakeAmount || 0
  );
  const [errorMessage, setErrorMessage] = useState<string | ReactNode>('');
  const { executeTask, getTaskStartPromise, getIsTaskLoading } =
    useStartingTasksContext();

  const { data: mainAccountPubKey = '' } = useMainAccount();
  const { data: stakingKeyPubKey = '' } = useStakingAccount();
  const { data: orcaStatus } = useOrcaPodman();
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
    closeAccordionView,
    DROPDOWN_MENU_ID
  );

  const { data: averageTaskReward } = useQuery({
    queryKey: [QueryKeys.TaskAverageReward, task.publicKey],
    queryFn: () => getLatestAverageTaskReward(task),
    // average task reward is not critical data, so we can use staleTime
    staleTime: 60 * 60 * 1000,
  });

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
  const nodesNumber = useMemo(() => TaskService.getNodesCount(task), [task]);
  const topStake = useMemo(() => TaskService.getTopStake(task), [task]);
  const totalBountyInKoii = useMemo(
    () => getKoiiFromRoe(task.totalBountyAmount),
    [task.totalBountyAmount]
  );
  const isEditStakeInputDisabled =
    alreadyStakedTokensAmount !== 0 || loadingTaskStake;
  const details = useMemo(
    () => ({
      nodesNumber,
      minStake: getKoiiFromRoe(minStake),
      topStake: getKoiiFromRoe(topStake),
      bounty: totalBountyInKoii,
    }),
    [nodesNumber, minStake, topStake, totalBountyInKoii]
  );

  const { metadata, isLoadingMetadata } = useMetadata({
    metadataCID: task.metadataCID,
    taskPublicKey: publicKey,
  });

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

  useAutoPairVariables({
    taskPublicKey: publicKey,
    taskVariables: globalAndTaskVariables,
  });

  useEffect(() => {
    getTaskStartPromise(publicKey)
      ?.then(() => {
        setTaskStartSucceeded(true);
        setTaskStartFailed(false);
      })
      .catch(() => {
        setTaskStartSucceeded(false);
        setTaskStartFailed(true);
      });
  }, [getTaskStartPromise, publicKey, task.publicKey, taskName]);

  useEffect(() => {
    const validateAllVariablesWerePaired = () => {
      const numberOfPairedVariables = Object.keys(pairedVariables || {}).length;

      const allVariablesWerePaired =
        (globalAndTaskVariables?.length || 0) === numberOfPairedVariables;
      // setIsGlobalToolsValid(allVariablesWerePaired);
      setIsTaskToolsValid(allVariablesWerePaired);
    };

    validateAllVariablesWerePaired();
  }, [pairedVariables, globalAndTaskVariables]);

  /**
   * @todo: replace with real token ticker, when api is ready
   */
  const tokenTicker = 'KOII';

  /**
   * @todo: get last reward from api
   */

  const taskTotalStake = useMemo(() => getTaskTotalStake(task), [task]);

  const validateTask = useCallback(() => {
    const hasEnoughKoii =
      (accountBalance >= CRITICAL_MAIN_ACCOUNT_BALANCE &&
        alreadyStakedTokensAmount >= minStake) ||
      accountBalance >= valueToStake + CRITICAL_MAIN_ACCOUNT_BALANCE;
    const hasMinimumStake =
      (alreadyStakedTokensAmount || valueToStake) >= minStake;
    const isTaskValid = hasMinimumStake && isTaskToolsValid && hasEnoughKoii;
    setIsTaskValidToRun(isTaskValid);

    const getErrorMessage = () => {
      if (isRunning) return '';

      const conditions = [
        {
          condition: hasEnoughKoii,
          errorMessage: `have enough ${tokenTicker} to stake`,
        },
        {
          condition: hasMinimumStake,
          errorMessage: `stake at least ${getKoiiFromRoe(
            minStake
          )} ${tokenTicker} on this Task`,
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

  const isUsingOrca = useMemo(() => isOrcaTask(metadata), [metadata]);

  const settingsViewIsOpen = accordionView === 'settings';
  const shouldNotShowSettingsView = !globalAndTaskVariables?.length;

  const handleStakeValueChange = (value: number) => {
    if (value) {
      // open task details if user is trying to stake if not open
      if (!settingsViewIsOpen && !shouldNotShowSettingsView) {
        handleToggleView('settings');
      }
    }
    setValueToStake(value);
  };

  const meetsMinimumStake = useMemo(
    () =>
      alreadyStakedTokensAmount >= getKoiiFromRoe(minStake) ||
      valueToStake >= getKoiiFromRoe(minStake),
    [alreadyStakedTokensAmount, valueToStake, minStake]
  );

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
          metadataCID={task.metadataCID}
          metadata={metadata ?? undefined}
          details={details}
          creator={task.taskManager}
          totalStake={taskTotalStake}
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
    task.metadataCID,
    task.taskManager,
    metadata,
    details,
    taskTotalStake,
    globalAndTaskVariables,
    closeAccordionView,
    handleOpenAddTaskVariableModal,
    handleToggleView,
  ]);

  const GearIcon = globalAndTaskVariables?.length ? GearFill : GearLine;
  const gearIconColor = isTaskToolsValid
    ? 'text-finnieEmerald-light'
    : 'text-finnieOrange';
  const gearTooltipContent = !globalAndTaskVariables?.length
    ? "This Task doesn't use any Task settings"
    : isTaskToolsValid
    ? 'Open task settings'
    : 'You need to set up the Task settings first in order to run this Task.';
  const runButtonTooltipContent =
    errorMessage || (isRunning ? 'Stop task' : 'Start task');

  const taskStartCompleted = useMemo(() => {
    if (!taskStartSucceeded && !taskStartFailed) return null;
    if (taskStartSucceeded) return <SuccessMessage />;
    return (
      <FailedMessage
        runTaskAgain={() => {
          executeTask({
            publicKey,
            valueToStake,
            alreadyStakedTokensAmount,
          });
          setTaskStartFailed(false);
        }}
      />
    );
  }, [taskStartSucceeded, taskStartFailed]);

  const averageReward = averageTaskReward
    ? getKoiiFromRoe(averageTaskReward)
    : null;

  const hideIfOrcaNotInstalled = useMemo(() => {
    return isUsingOrca && !orcaStatus?.isPodmanExists;
  }, [isUsingOrca, orcaStatus?.isPodmanExists]);

  const tableRowClasses = twMerge(
    'py-2 gap-y-0',
    hideIfOrcaNotInstalled && 'hidden'
  );

  const runTask = () => {
    executeTask({
      publicKey,
      valueToStake,
      alreadyStakedTokensAmount,
    });
    trackEvent('task_start', {
      taskName,
      taskPublicKey: publicKey,
      valueToStake,
    });
  };

  const { showModal: showConfirmRunTaskModal } = useConfirmRunTask({
    taskName: task.taskName,
    stake: alreadyStakedTokensAmount || valueToStake,
    onConfirm: runTask,
  });

  return (
    taskStartCompleted || (
      <TableRow
        columnsLayout={columnsLayout}
        className={tableRowClasses}
        ref={ref}
      >
        <div>
          <Popover
            theme={Theme.Dark}
            tooltipContent={`${
              accordionView === 'info'
                ? 'Close task details'
                : 'Open task details'
            }`}
          >
            <div className="flex flex-col items-center justify-start w-10">
              <Button
                onClick={() => handleToggleView('info')}
                icon={
                  <Icon
                    source={
                      accordionView === 'info'
                        ? CloseLine
                        : InformationCircleLine
                    }
                    size={36}
                  />
                }
                onlyIcon
              />
            </div>
          </Popover>
        </div>

        <Popover tooltipContent={taskName} theme={Theme.Dark}>
          <TaskName taskName={taskName} isUsingOrca={!!isUsingOrca} />
        </Popover>

        <TaskItemStatCell
          tooltipContent="Number of users running this task."
          label="Nodes"
          value={formatNumber(nodesNumber, false)}
        />

        <TaskItemStatCell
          tooltipContent="Token type"
          label="Token"
          /**
           * @todo: replace with actual token name when ready
           */
          value={tokenTicker}
        />

        <TaskItemStatCell
          tooltipContent="Amount of KOII given as reward on the last round."
          label="Last Reward"
          value={
            averageReward ? (
              <CurrencyDisplay
                amount={averageReward}
                currency="KOII"
                precision={2}
              />
            ) : (
              'N/A'
            )
          }
        />

        <RoundTime roundTimeInMs={roundTime} />

        <EditStakeInput
          meetsMinimumStake={meetsMinimumStake}
          stake={alreadyStakedTokensAmount || valueToStake}
          minStake={minStake as number}
          onChange={handleStakeValueChange}
          disabled={isEditStakeInputDisabled}
        />

        <Popover tooltipContent={gearTooltipContent} theme={Theme.Dark}>
          <div className="flex flex-col items-center justify-start w-10">
            <Button
              onMouseDown={() => handleToggleView('settings')}
              disabled={shouldNotShowSettingsView}
              icon={
                <Icon source={GearIcon} size={36} className={gearIconColor} />
              }
              onlyIcon
            />
          </div>
        </Popover>

        {getIsTaskLoading(publicKey) ? (
          <div className="py-[0.72rem]">
            <LoadingSpinner size={LoadingSpinnerSize.Large} />
          </div>
        ) : (
          <Popover theme={Theme.Dark} tooltipContent={runButtonTooltipContent}>
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
              onClick={isRunning ? handleStopTask : showConfirmRunTaskModal}
              disabled={!isRunning && !isTaskValidToRun}
            />
          </Popover>
        )}

        <div
          // FIXME: temporarly removed "overflow-x-hidden inner-scrollbar" because the dropdown is overflowed and hidden when placed on top select box
          className={`w-full col-span-9 overflow-y-auto ${
            accordionView !== null
              ? // 9000px is just a simbolic value of a ridiculously high height, the animation needs absolute max-h values to work properly (fit/max/etc won't work)
                'opacity-1 pt-6 max-h-[9000px]'
              : 'opacity-0 max-h-0'
          } transition-all duration-500 ease-in-out`}
        >
          <div ref={parent} className="flex w-full">
            {getTaskDetailsComponent()}
          </div>
        </div>
      </TableRow>
    )
  );
}

export default memo(AvailableTaskRow);
