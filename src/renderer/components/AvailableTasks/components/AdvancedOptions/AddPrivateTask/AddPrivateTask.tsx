import { useAutoAnimate } from '@formkit/auto-animate/react';
import React, {
  useState,
  useCallback,
  useMemo,
  useEffect,
  useRef,
  MutableRefObject,
  RefObject,
} from 'react';
import { useQueryClient } from 'react-query';

import { RequirementTag, RequirementType } from 'models';
import {
  getErrorMessage,
  showTaskRunErrorToast,
} from 'renderer/components/AvailableTasks/utils';
import {
  LoadingSpinner,
  LoadingSpinnerSize,
  TableRow,
  ColumnsLayout,
  EditStakeInput,
} from 'renderer/components/ui';
import {
  useMainAccount,
  useOnClickOutside,
  useAccountBalance,
  useMetadata,
  useAllStoredPairedTaskVariables,
  useAddTaskVariableModal,
  useTaskStake,
  usePrivateTasks,
  useStartingTasksContext,
  useStartedTasksPubKeys,
} from 'renderer/features';
import { stopTask } from 'renderer/services';
import { isValidWalletAddress } from 'renderer/utils';

import { StartPauseTaskButton } from '../../StartPauseTaskButton/StartPauseTaskButton';
import { SuccessMessage } from '../../SuccessMessage';
import { TaskErrorMessage } from '../../TaskErrorMessage';
import { PrivateTaskInput } from '../PrivateTaskInput';
import { useTaskById } from '../useTaskById';

import {
  DEFAULT_TASK_WARNING,
  TASK_ID_DOES_NOT_MATCH_WARNING,
  TASK_ALREADY_STARTED_WARNING,
} from './constants';
import { PrivateTaskWarning } from './PrivateTaskWarning';
import { SettingsAccordion } from './SettingsAccordion';
import { SettingsButton } from './SettingsButton';

interface Props {
  columnsLayout: ColumnsLayout;
  onClose: () => void;
}

// TODO: 1. handle the case if the task is already running
// TODO: 2. Add error cases where warning is
export function AddPrivateTask({ columnsLayout, onClose }: Props) {
  const { isLoading: loadingStartedTasks, data: startedTasks } =
    useStartedTasksPubKeys();
  const queryCache = useQueryClient();
  const { executeTask, getTaskStartPromise, getIsTaskLoading } =
    useStartingTasksContext();
  const { addPrivateTask } = usePrivateTasks();
  const { showModal: showAddTaskVariableModal } = useAddTaskVariableModal();
  const [taskPubkey, setTaskPubkey] = useState<string>('');
  const [isValidPublicKey, setIsValidPublicKey] = useState<boolean>(false);

  const [isAddTaskSettingModalOpen, setIsAddTaskSettingModalOpen] =
    useState<boolean>(false);
  useState<boolean>(false);

  const [accordionView, setAccordionView] = useState<boolean>(false);
  const [isTaskToolsValid, setIsTaskToolsValid] = useState(false);
  const [isTaskValidToRun, setIsTaskValidToRun] = useState(false);
  const [taskStartSucceeded, setTaskStartSucceeded] = useState(false);
  const [valueToStake, setValueToStake] = useState<number>(0);
  const [meetsMinimumStake, setMeetsMinimumStake] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string[]>([]);
  const [taskWarning, setTaskWarning] = useState<string>(DEFAULT_TASK_WARNING);
  const { data: mainAccountPubKey = '' } = useMainAccount();

  const {
    data: task,
    isLoading: loadingTask,
    error: taskLoadingError,
  } = useTaskById({
    taskPubkey,
    options: {
      enabled:
        !!taskPubkey &&
        !!mainAccountPubKey &&
        isValidPublicKey &&
        !loadingStartedTasks,
      // never cache this query because we want to always get the latest task data
      cacheTime: 0,
      onSettled: (data) => {
        if (!data) {
          setTaskWarning(TASK_ID_DOES_NOT_MATCH_WARNING);
        } else if (startedTasks?.includes(taskPubkey)) {
          setTaskWarning(TASK_ALREADY_STARTED_WARNING);
        } else {
          setTaskWarning(DEFAULT_TASK_WARNING);
        }
      },
    },
  });

  const { accountBalance = 0 } = useAccountBalance(mainAccountPubKey);

  const {
    storedPairedTaskVariablesQuery: { data: allPairedVariables = {} },
  } = useAllStoredPairedTaskVariables({
    enabled: !!taskPubkey,
  });

  const pairedVariables = Object.entries(allPairedVariables).filter(
    ([taskId]) => taskId === taskPubkey
  )[0]?.[1];

  const ref = useRef<HTMLDivElement>(null);

  const [parent] = useAutoAnimate();

  const closeAccordionView = useCallback(() => {
    if (isAddTaskSettingModalOpen) {
      return;
    }
    setAccordionView(false);
  }, [isAddTaskSettingModalOpen]);

  useOnClickOutside(
    ref as MutableRefObject<HTMLDivElement>,
    closeAccordionView
  );

  const handleToggleView = useCallback(() => {
    setAccordionView((prevState) => !prevState);
  }, []);

  const handleTaskToolsValidationCheck = (isValid: boolean) => {
    setIsTaskToolsValid(isValid);
  };

  const handleInputChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = e.target;
    const isValid = await isValidWalletAddress(value);

    if (isValid) {
      console.log(`Task ${value} is valid to run!`);
      setIsValidPublicKey(true);
    } else {
      setIsValidPublicKey(false);
      setTaskWarning(TASK_ID_DOES_NOT_MATCH_WARNING);
    }

    setTaskPubkey(value);
  };

  const minStake = task?.minimumStakeAmount;

  const { metadata } = useMetadata({
    metadataCID: task?.metadataCID ?? null,
    queryOptions: {
      enabled: !!task?.metadataCID,
    },
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

  const { taskStake: alreadyStakedTokensAmount, loadingTaskStake } =
    useTaskStake({
      task,
      publicKey: mainAccountPubKey,
      enabled: !!mainAccountPubKey && !!task,
    });

  useEffect(() => {
    getTaskStartPromise(taskPubkey)
      ?.then(() => {
        setTaskStartSucceeded(true);
      })
      .catch(() => {
        setTaskStartSucceeded(false);
        showTaskRunErrorToast(task?.taskName);
      });
  }, [getTaskStartPromise, taskPubkey, task, task?.taskName]);

  useEffect(() => {
    const validateAllVariablesWerePaired = () => {
      const numberOfPairedVariables = Object.keys(pairedVariables || {}).length;

      const allVariablesWerePaired =
        (globalAndTaskVariables?.length || 0) === numberOfPairedVariables;
      setIsTaskToolsValid(allVariablesWerePaired);
    };

    validateAllVariablesWerePaired();
  }, [pairedVariables, globalAndTaskVariables]);

  const validateTask = useCallback(() => {
    const hasEnoughKoii =
      accountBalance > Number(minStake) && accountBalance > valueToStake;
    const hasMinimumStake =
      (alreadyStakedTokensAmount || valueToStake) >= Number(minStake);
    const isTaskValid = hasMinimumStake && isTaskToolsValid && hasEnoughKoii;

    setIsTaskValidToRun(isTaskValid);

    const errorMessage = getErrorMessage({
      hasEnoughKoii,
      minStake,
      isTaskRunning: !!task?.isRunning,
      hasMinimumStake,
      isTaskToolsValid,
    });

    setErrorMessage(errorMessage);
  }, [
    accountBalance,
    minStake,
    valueToStake,
    alreadyStakedTokensAmount,
    isTaskToolsValid,
    task?.isRunning,
  ]);

  useEffect(() => {
    validateTask();
  }, [validateTask]);

  const handleStopTask = async () => {
    try {
      await stopTask(taskPubkey);
    } catch (error) {
      console.error(error);
    } finally {
      queryCache.invalidateQueries();
    }
  };

  const handleStakeValueChange = (value: number) => {
    setValueToStake(value);
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    setMeetsMinimumStake(value >= minStake!);
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

  const handleStartTask = async () => {
    try {
      await executeTask({
        publicKey: taskPubkey,
        valueToStake,
        isPrivate: true,
        alreadyStakedTokensAmount,
      });

      console.log('Task started successfully!');
      console.log(
        `Task is private! Adding ${taskPubkey} to private tasks list...`
      );

      await addPrivateTask(taskPubkey);
    } catch (error) {
      console.error(error);
    }
  };

  const isEditStakeInputDisabled = useMemo(
    () => alreadyStakedTokensAmount !== 0 || loadingTaskStake || !task,
    [alreadyStakedTokensAmount, loadingTaskStake, task]
  );

  const getTooltipContent = useCallback(() => {
    if (!task) return 'Provide the task public key to start the task.';
    if (task?.isRunning) return 'Stop task';
    if (errorMessage) return <TaskErrorMessage errors={errorMessage} />;
    return 'Start task';
  }, [task, errorMessage]);

  const runButtonTooltipContent = getTooltipContent();
  const taskAlreadyAdded = useMemo(
    () => startedTasks?.includes(taskPubkey),
    [startedTasks, taskPubkey]
  );

  return taskStartSucceeded ? (
    <SuccessMessage />
  ) : (
    <div className="border-t-2 border-white">
      <div className="pb-2 rounded-b-lg bg-finniePurple bg-opacity-10">
        <PrivateTaskWarning taskWarning={taskWarning} />
        <TableRow
          columnsLayout={columnsLayout}
          className="border-b-0 gap-y-0"
          ref={ref}
        >
          <PrivateTaskInput
            onChange={handleInputChange}
            task={task}
            taskPubkey={taskPubkey}
            alreadyStarted={taskAlreadyAdded}
            loadingTask={loadingTask}
            onClose={onClose}
          />

          <div className="mt-4">
            <EditStakeInput
              meetsMinimumStake={meetsMinimumStake}
              stake={valueToStake}
              minStake={minStake as number}
              onChange={handleStakeValueChange}
              disabled={isEditStakeInputDisabled}
            />
          </div>

          <SettingsButton
            isTaskToolsValid={isTaskToolsValid}
            globalAndTaskVariables={globalAndTaskVariables}
            onToggleView={handleToggleView}
          />

          {getIsTaskLoading(taskPubkey) ? (
            <div className="py-[0.72rem]">
              <LoadingSpinner size={LoadingSpinnerSize.Large} />
            </div>
          ) : (
            <StartPauseTaskButton
              isRunning={!!task?.isRunning}
              onStartTask={handleStartTask}
              onStopTask={handleStopTask}
              tooltipContent={runButtonTooltipContent}
              isTaskValidToRun={isTaskValidToRun}
              disabled={taskAlreadyAdded}
            />
          )}
          <SettingsAccordion
            ref={parent}
            taskPubkey={taskPubkey}
            isOpen={accordionView}
            globalAndTaskVariables={globalAndTaskVariables}
            onTaskToolsValidationCheck={handleTaskToolsValidationCheck}
            onCloseAccordionView={closeAccordionView}
            onOpenAddTaskVariableModal={handleOpenAddTaskVariableModal}
          />
        </TableRow>
      </div>
    </div>
  );
}
