import {
  CloseLine,
  Icon,
  InformationCircleLine,
  CheckSuccessLine,
} from '@_koii/koii-styleguide';
import React, { useState, useMemo } from 'react';
import toast from 'react-hot-toast';

import CloseIcon from 'assets/svgs/close-icons/close-icon.svg';
import { TaskInfo } from 'renderer/components/AvailableTasks/components/TaskInfo';
import { EditStakeInput, Tooltip, Button } from 'renderer/components/ui';
import { useMetadata, useClipboard } from 'renderer/features/common';
import { TaskService } from 'renderer/services';
import { Task } from 'renderer/types';
import { Theme } from 'renderer/types/common';
import { getKoiiFromRoe } from 'utils';

type PropsType = {
  stakeValue: number;
  index: number;
  onStakeInputChange: (newStake: number) => void;
  onRemove: () => void;
  task: Task;
};

function TaskItem({
  stakeValue,
  onStakeInputChange,
  onRemove,
  index,
  task,
}: PropsType) {
  const [meetsMinimumStake, setMeetsMinimumStake] = useState<boolean>(false);
  const [accordionView, setAccordionView] = useState<boolean>(false);
  const { metadata } = useMetadata({
    metadataCID: task.metadataCID,
  });
  const { copyToClipboard } = useClipboard();

  const isFirstRowInTable = index === 0;
  const handleStakeInputChange = (newStake: number) => {
    setMeetsMinimumStake(newStake >= task.minimumStakeAmount);
    onStakeInputChange(newStake);
  };
  const nodes = useMemo(() => TaskService.getNodesCount(task), [task]);
  const topStake = useMemo(() => TaskService.getTopStake(task), [task]);
  const totalBountyInKoii = useMemo(
    () => getKoiiFromRoe(task.totalBountyAmount),
    [task.totalBountyAmount]
  );

  const details = {
    nodes,
    minStake: getKoiiFromRoe(task.minimumStakeAmount),
    topStake,
    bounty: totalBountyInKoii,
  };
  const handleCopyCreatorAddress = () => {
    copyToClipboard(task.taskManager);
    toast.success('Creators address copied!', {
      duration: 1500,
      icon: <CheckSuccessLine className="h-5 w-5" />,
      style: {
        backgroundColor: '#BEF0ED',
        paddingRight: 0,
      },
    });
  };
  return (
    <div className="w-full">
      <div className="grid w-full mb-4 text-sm text-left rounded-md bg-finnieBlue-light-secondary h-13 grid-cols-first-task place-content-center">
        <div className="col-span-1 m-auto">
          <Tooltip
            theme={Theme.Light}
            placement={`${isFirstRowInTable ? 'bottom' : 'top'}-right`}
            tooltipContent="Open task details"
          >
            <div className="flex flex-col h-full items-center justify-start w-10">
              <Button
                onClick={() => setAccordionView(!accordionView)}
                icon={
                  <Icon
                    source={accordionView ? CloseLine : InformationCircleLine}
                    size={24}
                  />
                }
                className="outline-none"
                onlyIcon
              />
            </div>
          </Tooltip>
        </div>

        <div className="col-span-5 my-auto mr-4">{task.taskName}</div>
        <div className="col-span-5 flex items-center">
          <Tooltip
            theme={Theme.Light}
            placement={`${isFirstRowInTable ? 'bottom' : 'top'}-right`}
            tooltipContent={<p>{task.taskManager}</p>}
          >
            <div className="max-w-[100px] xl:max-w-[170px] w-full flex flex-col h-full overflow-hidden text-ellipsis">
              <button
                className="overflow-hidden text-ellipsis"
                onClick={handleCopyCreatorAddress}
              >
                {task.taskManager}
              </button>
            </div>
          </Tooltip>
        </div>

        <div className="col-span-5 col-start-13 2xl:col-start-15 2xl:col-span-3 mt-1">
          <EditStakeInput
            stake={stakeValue}
            onChange={handleStakeInputChange}
            meetsMinimumStake={meetsMinimumStake}
            minStake={task.minimumStakeAmount}
          />
        </div>

        <button
          className="m-auto cursor-pointer text-finnieRed"
          onClick={onRemove}
        >
          <Tooltip placement="top-left" tooltipContent="Remove task">
            <div className="w-6 mr-2">
              <CloseIcon />
            </div>
          </Tooltip>
        </button>
      </div>
      {accordionView && (
        <TaskInfo
          publicKey={task.publicKey}
          metadata={metadata ?? undefined}
          details={details}
          showSourceCode={false}
        />
      )}
    </div>
  );
}

export default TaskItem;
