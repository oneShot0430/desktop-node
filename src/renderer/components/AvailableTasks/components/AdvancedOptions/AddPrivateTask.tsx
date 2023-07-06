import {
  CloseLine,
  Icon,
  PlayFill,
  PauseFill,
  WarningTriangleFill,
  CheckSuccessLine,
} from '@_koii/koii-styleguide';
import { useAutoAnimate } from '@formkit/auto-animate/react';
import React, {
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
import InputField from 'renderer/components/InputField';
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
  useOnClickOutside,
  useAccountBalance,
  useMetadata,
  useAllStoredPairedTaskVariables,
  useAddTaskVariableModal,
  useStartingTasksContext,
  useTaskStake,
} from 'renderer/features';
import { stopTask } from 'renderer/services';
import { isValidWalletAddress } from 'renderer/utils';
import { getKoiiFromRoe } from 'utils';

import { SuccessMessage } from '../SuccessMessage';
import { TaskSettings } from '../TaskSettings';

import { useTaskById } from './useTaskById';

interface Props {
  columnsLayout: ColumnsLayout;
  onClose: () => void;
}

const DEFAULT_TASK_WARNING =
  'Any task run by TaskID is not verified by the Koii team and community. Run with caution.';

const TASK_ID_DOES_NOT_MATCH_WARNING =
  'Whoops! That TaskID doesn’t match any tasks in the network. Please double check and try again.';

export function AddPrivateTask({ columnsLayout, onClose }: Props) {
  const [taskPubkey, setTaskPubkey] = useState<string>('');
  const [isValidPublicKey, setIsValidPublicKey] = useState<boolean>(false);

  const [isAddTaskSettingModalOpen, setIsAddTaskSettingModalOpen] =
    useState<boolean>(false);
  useState<boolean>(false);
  const { showModal: showAddTaskVariableModal } = useAddTaskVariableModal();
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
  const [taskWarning, setTaskWarning] = useState<string | ReactNode>(
    DEFAULT_TASK_WARNING
  );
  const { executeTask, getTaskStartPromise, getIsTaskLoading } =
    useStartingTasksContext();
  const { data: mainAccountPubKey = '' } = useMainAccount();

  const {
    data: task,
    isLoading: loadingTask,
    error: taskLoadingError,
  } = useTaskById({
    taskPubkey,
    options: {
      enabled: !!taskPubkey && !!mainAccountPubKey && isValidPublicKey,
      // never cache this query because we want to always get the latest task data
      cacheTime: 0,
      onSettled: (data) => {
        if (!data) {
          setTaskWarning(TASK_ID_DOES_NOT_MATCH_WARNING);
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
    setAccordionView(null);
  }, [isAddTaskSettingModalOpen]);

  useOnClickOutside(
    ref as MutableRefObject<HTMLDivElement>,
    closeAccordionView
  );

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

  const handleInputChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = e.target;
    const isValid = await isValidWalletAddress(value);

    if (isValid) {
      console.log(`Task ${value} is valid to run!`);
      setIsValidPublicKey(true);
    } else {
      setIsValidPublicKey(false);
    }

    setTaskPubkey(value);
  };

  const minStake = task?.minimumStakeAmount || null;

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
        toast.error(
          `Task ${task?.taskName} running failed. Please try again!`,
          {
            duration: 4500,
            icon: <CloseLine className="h-5 w-5" />,
            style: {
              backgroundColor: '#FFA6A6',
              paddingRight: 0,
            },
          }
        );
      });
  }, [getTaskStartPromise, taskPubkey, task, task?.taskName]);

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
      accountBalance > Number(minStake) && accountBalance > valueToStake;
    const hasMinimumStake =
      (alreadyStakedTokensAmount || valueToStake) >= Number(minStake);
    const isTaskValid = hasMinimumStake && isTaskToolsValid && hasEnoughKoii;
    setIsTaskValidToRun(isTaskValid);

    const getErrorMessage = () => {
      if (task?.isRunning) return '';

      const conditions = [
        { condition: hasEnoughKoii, errorMessage: 'have enough KOII to stake' },
        {
          condition: hasMinimumStake,
          errorMessage: `stake at least ${getKoiiFromRoe(
            // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
            minStake!
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

  console.log('####alreadyStakedTokensAmount', alreadyStakedTokensAmount);

  const handleStartTask = () => {
    executeTask({
      publicKey: taskPubkey,
      valueToStake,
      force: true,
      alreadyStakedTokensAmount,
    });
  };

  const isEditStakeInputDisabled = useMemo(
    () => alreadyStakedTokensAmount !== 0 || loadingTaskStake || !task,
    [alreadyStakedTokensAmount, loadingTaskStake, task]
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
    errorMessage || (task?.isRunning ? 'Stop task' : 'Start task');

  return taskStartSucceeded ? (
    <SuccessMessage />
  ) : (
    <div className="bg-finnieBlue">
      <div className="bg-finniePurple bg-opacity-20 rounded-b-lg">
        <div className="flex gap-2 items-center text-xs pl-6 pt-2 text-[#FFA54B]">
          <WarningTriangleFill className="text-sm" />
          {taskWarning}
        </div>
        <TableRow
          columnsLayout={columnsLayout}
          className="py-2 gap-y-0 border-b-0"
          ref={ref}
        >
          <div className="justify-self-start flex items-center gap-4 pl-6">
            <Button
              onlyIcon
              icon={<Icon source={CloseLine} size={20} onClick={onClose} />}
            />
            <InputField
              className="w-[244px] mt-4"
              label=""
              name="private-task-pubKey"
              placeholder="Public Key"
              value={taskPubkey}
              onChange={handleInputChange}
              error={
                !isValidPublicKey
                  ? 'Invalid public key'
                  : '' || (taskLoadingError as string)
              }
            />
            {loadingTask ? (
              <LoadingSpinner />
            ) : (
              !!task && (
                <Icon
                  source={CheckSuccessLine}
                  className="text-finnieTeal"
                  size={20}
                />
              )
            )}
          </div>

          <div className="mt-4">
            <EditStakeInput
              meetsMinimumStake={meetsMinimumStake}
              stake={valueToStake}
              minStake={minStake as number}
              onChange={handleStakeValueChange}
              // FIXME
              disabled={isEditStakeInputDisabled}
            />
          </div>

          <Tooltip placement="top-left" tooltipContent={gearTooltipContent}>
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

          {getIsTaskLoading(taskPubkey) ? (
            <div className="py-[0.72rem]">
              <LoadingSpinner size={LoadingSpinnerSize.Large} />
            </div>
          ) : (
            <Tooltip
              placement="top-left"
              tooltipContent={runButtonTooltipContent}
            >
              <Button
                onlyIcon
                icon={
                  <Icon
                    source={task?.isRunning ? PauseFill : PlayFill}
                    size={18}
                    className={`w-full flex my-4 ${
                      isTaskValidToRun || task?.isRunning
                        ? 'text-finnieTeal'
                        : 'text-gray-500 cursor-not-allowed'
                    }`}
                  />
                }
                onClick={task?.isRunning ? handleStopTask : handleStartTask}
                disabled={!task?.isRunning && !isTaskValidToRun}
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
            <div ref={parent} className="flex w-full pl-4">
              <TaskSettings
                taskPubKey={taskPubkey}
                onToolsValidation={handleTaskToolsValidationCheck}
                taskVariables={globalAndTaskVariables}
                onPairingSuccess={closeAccordionView}
                onOpenAddTaskVariableModal={handleOpenAddTaskVariableModal}
                moveToTaskInfo={() => handleToggleView('info')}
              />
            </div>
          </div>
          <Toaster />
        </TableRow>
      </div>
    </div>
  );
}
