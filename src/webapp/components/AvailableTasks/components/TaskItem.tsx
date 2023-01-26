import {
  CloseLine,
  Icon,
  SettingsFill,
  PlayFill,
  InformationCircleLine,
} from '@_koii/koii-styleguide';
import React, { memo, useState, useCallback, useMemo, useEffect } from 'react';
import { useQuery, useQueryClient } from 'react-query';

import PlayIcon from 'assets/svgs/play-icon.svg';
import StopTealIcon from 'assets/svgs/stop-icon-teal.svg';
import { EditStakeInput } from 'features/onboarding';
import { getKoiiFromRoe } from 'utils';
import {
  Button,
  LoadingSpinner,
  LoadingSpinnerSize,
  Tooltip,
  TableRow,
  ColumnsLayout,
} from 'webapp/components';
import { useTaskDetailsModal, useTaskStake } from 'webapp/features/common';
import {
  QueryKeys,
  TaskService,
  stopTask,
  getMainAccountPublicKey,
  stakeOnTask,
  startTask,
} from 'webapp/services';
import { Task } from 'webapp/types';

import { TaskInfo } from './TaskInfo';
import { TaskSettings } from './TaskSettings';

interface Props {
  task: Task;
  index: number;
  columnsLayout: ColumnsLayout;
}

const TaskItem = ({ task, index, columnsLayout }: Props) => {
  const { taskName, publicKey, taskManager, isRunning } = task;
  const queryCache = useQueryClient();
  const [accordionView, setAccordionView] = useState<
    'info' | 'settings' | null
  >(null);
  const [isNodeToolsValid, setIsNodeToolsValid] = useState(false);
  const [isTaskValidToRun, setIsTaskValidToRun] = useState(false);
  const [stake, setStake] = useState<number>(0);
  const [meetsMinimumStake, setMeetsMinimumStake] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);

  /**
   * @todo: abstract it away to the hook,
   * We probably should fetch the Account pub key once and keep it in the app context
   */
  const { data: mainAccountPubKey, isLoading: loadingMainAccount } = useQuery(
    QueryKeys.MainAccount,
    () => getMainAccountPublicKey()
  );

  const { taskStake: alreadyStakedTokensAmount, loadingTaskStake } =
    useTaskStake({
      task,
      publicKey: mainAccountPubKey,
      enabled: !!mainAccountPubKey,
    });

  const { showModal: showCodeModal } = useTaskDetailsModal({
    task,
    accountPublicKey: mainAccountPubKey,
  });

  const handleToggleSettings = () => {
    const newView = accordionView === 'settings' ? null : 'settings';
    setAccordionView(newView);
  };

  const handleToggleInfo = () => {
    if (accordionView === 'info') {
      setAccordionView(null);
      return;
    }
    setAccordionView('info');
  };

  const handleNodeToolsValidationCheck = (isValid: boolean) => {
    setIsNodeToolsValid(isValid);
  };

  const isFirstRowInTable = index === 0;
  const nodes = useMemo(() => TaskService.getNodesCount(task), [task]);
  const topStake = useMemo(() => TaskService.getTopStake(task), [task]);
  // const bountyPerRoundInKoii = useMemo(
  //   () => getKoiiFromRoe(bountyAmountPerRound),
  //   [bountyAmountPerRound]
  // );

  const { data: minStake } = useQuery([QueryKeys.minStake, publicKey], () =>
    TaskService.getMinStake(task)
  );

  const validateTask = useCallback(() => {
    const hasMinimumStake = stake >= minStake;
    const isTaskValid = hasMinimumStake && isNodeToolsValid;
    setIsTaskValidToRun(isTaskValid);
  }, [isNodeToolsValid, minStake, stake]);

  useEffect(() => {
    validateTask();
  }, [minStake, stake, validateTask, isNodeToolsValid]);

  const handleStartTask = async () => {
    const stakeAmount = alreadyStakedTokensAmount || stake;

    try {
      setLoading(true);
      if (stakeAmount === 0) {
        await stakeOnTask(publicKey, stakeAmount);
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
    setStake(value);
    setMeetsMinimumStake(value >= minStake);
  };

  const getTaskPlayButtonIcon = useCallback(() => {
    if (isRunning) {
      return <StopTealIcon />;
    }

    return isTaskValidToRun ? (
      <PlayIcon />
    ) : (
      <Icon
        source={PlayFill}
        size={18}
        className="cursor-not-allowed text-gray"
      />
    );
  }, [isRunning, isTaskValidToRun]);

  const getTaskDetailsComponent = useCallback(() => {
    if (accordionView === 'info') {
      return <TaskInfo task={task} onShowCodeClick={showCodeModal} />;
    }

    if (accordionView === 'settings') {
      return (
        <TaskSettings
          taskPubKey={task.publicKey}
          onNodeToolsValidation={handleNodeToolsValidationCheck}
        />
      );
    }

    return null;
  }, [accordionView, task, showCodeModal]);

  if (loadingMainAccount) return null;

  return (
    <TableRow columnsLayout={columnsLayout} className="py-2">
      <div>
        <Tooltip
          placement={`${isFirstRowInTable ? 'bottom' : 'top'}-right`}
          tooltipContent="Open task details"
        >
          <div className="flex flex-col items-center justify-start w-[40px]">
            <Button
              icon={
                <Icon
                  source={
                    accordionView === 'info' ? CloseLine : InformationCircleLine
                  }
                  size={36}
                />
              }
              onlyIcon
              onClick={handleToggleInfo}
            />
          </div>
        </Tooltip>
      </div>

      <div className="flex flex-col gap-2 text-xs">
        <div>{taskName}</div>
        <div className="text-finnieTeal">
          {task?.metadata?.createdAt ?? 'N/A'}
        </div>
      </div>

      <div
        className="flex flex-col gap-2 text-xs min-w-[160px]"
        title={taskManager}
      >
        <div className="truncate">{`Creator: ${task.taskName}`}</div>
        <div className="truncate">{`Bounty: ${task.totalBountyAmount}`}</div>
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
          stake={alreadyStakedTokensAmount || stake}
          minStake={minStake}
          onChange={handleStakeValueChange}
          disabled={alreadyStakedTokensAmount !== 0 || loadingTaskStake}
        />
      </div>

      <div>
        <div>
          <Tooltip
            placement={`${isFirstRowInTable ? 'bottom' : 'top'}-right`}
            tooltipContent="Open task settings"
          >
            <div className="flex flex-col items-center justify-start w-[40px]">
              <Button
                onClick={handleToggleSettings}
                icon={
                  <Icon
                    source={SettingsFill}
                    size={36}
                    className="text-finnieOrange"
                  />
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
              disabled={!meetsMinimumStake}
            />
          </Tooltip>
        )}
      </div>

      <div
        className={`w-full col-span-7 max-h-[360px] overflow-y-auto ${
          accordionView !== null ? 'flex' : 'hidden'
        } transition-all duration-500 ease-in-out`}
      >
        {getTaskDetailsComponent()}
      </div>
    </TableRow>
  );
};

export default memo(TaskItem);
