import {
  Icon,
  InformationCircleLine,
  EditPencilLine,
} from '@_koii/koii-styleguide';
import React, { useState, useMemo } from 'react';
import toast from 'react-hot-toast';

import { Tooltip, Button } from 'renderer/components/ui';
import { useClipboard } from 'renderer/features/common';
import { useMetadata } from 'renderer/features/tasks';
import { TaskInfo } from 'renderer/features/tasks/components/TaskInfo';
import { getTaskTotalStake } from 'renderer/features/tasks/utils';
import { TaskService } from 'renderer/services';
import { Task } from 'renderer/types';
import { Theme } from 'renderer/types/common';
import { getKoiiFromRoe } from 'utils';

import { EditStakeInput } from './EditStakeInput';

type PropsType = {
  stakeValue: number;
  index: number;
  onStakeInputChange: (newStake: number) => void;
  onRemove: () => void;
  task: Task;
  setShowMinimumStakeError: React.Dispatch<React.SetStateAction<boolean>>;
};

function TaskItem({
  stakeValue,
  onStakeInputChange,
  index,
  task,
  setShowMinimumStakeError,
}: PropsType) {
  const [meetsMinimumStake, setMeetsMinimumStake] = useState<boolean>(false);
  const [accordionView, setAccordionView] = useState<boolean>(false);
  const [editStakeView, setEditStakeView] = useState<boolean>(false);
  const { metadata } = useMetadata({
    metadataCID: task.metadataCID,
    taskPublicKey: task.publicKey,
  });
  const { copyToClipboard } = useClipboard();

  const minStakeInKoii = getKoiiFromRoe(task.minimumStakeAmount);
  const stakeValueInKoii = getKoiiFromRoe(stakeValue);

  const isFirstRowInTable = index === 0;
  const handleStakeInputChange = (newStake: number) => {
    setMeetsMinimumStake(newStake >= task.minimumStakeAmount);
    setShowMinimumStakeError(newStake <= task.minimumStakeAmount);
    onStakeInputChange(newStake);
  };

  const handleChangeStakeView = () => {
    setEditStakeView(!editStakeView);
  };
  const nodesNumber = useMemo(() => TaskService.getNodesCount(task), [task]);
  const topStake = useMemo(() => TaskService.getTopStake(task), [task]);
  const totalBountyInKoii = useMemo(
    () => getKoiiFromRoe(task.totalBountyAmount),
    [task.totalBountyAmount]
  );

  const details = {
    nodesNumber,
    minStake: getKoiiFromRoe(task.minimumStakeAmount),
    topStake: getKoiiFromRoe(topStake),
    bounty: totalBountyInKoii,
  };
  const handleCopyCreatorAddress = () => {
    copyToClipboard(task.taskManager);
    toast.success('Creators address copied!');
  };

  const taskTotalStake = useMemo(() => getTaskTotalStake(task), [task]);

  return (
    <div className="w-full relative max-w-[1100px]">
      <div className="sticky top-0 z-[100] mb-1 bg-finnieBlue-dark-secondary">
        <div className="grid w-full text-sm text-left rounded-md bg-finnieBlue-light-secondary h-13 grid-cols-first-task place-content-center">
          <div className="col-span-2 m-auto">
            <Tooltip
              theme={Theme.Light}
              placement={`${isFirstRowInTable ? 'bottom' : 'top'}-right`}
              tooltipContent={`${
                accordionView ? 'Close task details' : 'Open task details'
              }`}
            >
              <div className="flex flex-col items-center justify-start h-full">
                <Button
                  onClick={() => setAccordionView(!accordionView)}
                  icon={
                    <Icon
                      source={InformationCircleLine}
                      size={24}
                      className={`${
                        accordionView
                          ? 'text-finnieEmerald-light'
                          : 'text-white'
                      }`}
                    />
                  }
                  className="outline-none"
                  onlyIcon
                />
              </div>
            </Tooltip>
          </div>

          <div className="col-span-6 my-auto cursor-pointer">
            <Tooltip
              theme={Theme.Light}
              placement={`${isFirstRowInTable ? 'bottom' : 'top'}-right`}
              tooltipContent={
                <p>
                  This task was created by the Koii team and is safe to run.
                </p>
              }
            >
              {task.taskName}
            </Tooltip>
          </div>
          <div className="flex items-center col-span-6">
            <Tooltip
              theme={Theme.Light}
              placement={`${isFirstRowInTable ? 'bottom' : 'top'}-right`}
              tooltipContent={<p>{task.taskManager}</p>}
            >
              <div className="max-w-[150px] xl:max-w-[200px] w-full flex flex-col h-full overflow-hidden text-ellipsis">
                <button
                  className="overflow-hidden text-ellipsis"
                  onClick={handleCopyCreatorAddress}
                >
                  {task.taskManager}
                </button>
              </div>
            </Tooltip>
          </div>

          <div className="col-span-4 2xl:col-start-15 2xl:col-span-4">
            {!editStakeView ? (
              <div className="flex gap-1">
                <p>{stakeValueInKoii} KOII</p>
                <button
                  className="text-white cursor-pointer "
                  onClick={handleChangeStakeView}
                >
                  <div className="w-7">
                    <EditPencilLine />
                  </div>
                </button>
              </div>
            ) : (
              <EditStakeInput
                stake={stakeValue}
                onChange={handleStakeInputChange}
                meetsMinimumStake={meetsMinimumStake}
                handleChangeStakeView={handleChangeStakeView}
              />
            )}
          </div>
        </div>
        <div className="grid grid-cols-first-task w-full mb-1.5">
          <div className="col-span-4 text-xs leading-4 col-start-15 text-finnieEmerald-light">
            minimum: {minStakeInKoii}
          </div>
        </div>
      </div>
      {accordionView && (
        <div className="p-6 rounded-lg bg-finnieBlue-light-secondary">
          <div className="h-[200px] overflow-y-auto">
            <TaskInfo
              publicKey={task.publicKey}
              creator={task.taskManager}
              metadataCID={task.metadataCID}
              metadata={metadata ?? undefined}
              details={details}
              isOnboardingTask
              totalStake={taskTotalStake}
            />
          </div>
        </div>
      )}
    </div>
  );
}

export default TaskItem;
