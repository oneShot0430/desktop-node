import React, { useState } from 'react';
import { useQuery } from 'react-query';

import ExternalSourceIconSvg from 'assets/svgs/external-source-icon-white.svg';
import FlagIconTealSvg from 'assets/svgs/flag-teal-icon.svg';
import CloseIcon from 'svgs/close-icons/close-icon-white.svg';
import { Task } from 'webapp/@type/task';
import { Button } from 'webapp/components/ui/Button';
import {
  QueryKeys,
  getRewardEarned,
  TaskService,
  TaskStatusToLabeMap,
} from 'webapp/services';

import { SourceCode } from './SourceCode';
import { TaskDetails } from './TaskDetails';

const exampleSourceCode = `#!/usr/bin/env node require("dotenv").config();
const prompts = require("prompts");
const kohaku = require("@_koi/kohaku");
`;

type TabsType = 'TaskDetails' | 'SourceCode';

type PropsType = {
  task: Task;
  onClose: () => void;
};

export const TaskDetailsModal = ({ task, onClose }: PropsType) => {
  const [currentView, setCurrentView] = useState<TabsType>('TaskDetails');

  const { data: myTotalRewards } = useQuery(
    [QueryKeys.taskReward, task.publicKey],
    () => getRewardEarned(task)
  );

  const totalStake = TaskService.getTotalStaked(task);
  const nodes = TaskService.getNodesCount(task);
  const topStake = TaskService.getTopStake(task);
  const state = TaskStatusToLabeMap[TaskService.getStatus(task)];

  const { data: myStake } = useQuery([QueryKeys.myStake, task.publicKey], () =>
    TaskService.getMyStake(task)
  );

  const handleWithdraw = () => {
    console.log('Wthdraw action');
  };

  const activeClasses = 'border-b-2 border-finnieEmerald-light';

  return (
    <div className="pt-6 pl-8 pr-8">
      <div className="flex justify-between">
        <div className="flex justify-start gap-6 pl-6 mb-5">
          <div
            className={`${
              currentView === 'TaskDetails' && activeClasses
            } text-semibold`}
            onClick={() => setCurrentView('TaskDetails')}
          >
            Task Details
          </div>
          <div
            className={`${
              currentView === 'SourceCode' && activeClasses
            } text-semibold`}
            onClick={() => setCurrentView('SourceCode')}
          >
            Source Code
          </div>
        </div>

        <CloseIcon
          data-testid="close-modal-button"
          onClick={onClose}
          className="w-[24px] h-[24px] cursor-pointer"
        />
      </div>

      <div className="flex items-center mb-5 w-[100%]">
        <div className="cursor-pointer">
          <FlagIconTealSvg />
        </div>
        <div className="pl-[14px] pr-[14px]">
          Inspect{' '}
          <span className="text-finnieEmerald-light">{task.taskName}</span>{' '}
          Source Code
        </div>
        {/*TODO: handle open in the browser window */}
        {currentView === 'SourceCode' && (
          <a className="cursor-pointer" href="/">
            <ExternalSourceIconSvg />
          </a>
        )}
      </div>

      <div>
        {currentView === 'TaskDetails' && (
          <>
            <div className="pl-6">
              <TaskDetails
                owner={task.taskManager}
                totalBounty={task.bountyAmountPerRound}
                nodesParticipating={nodes}
                totalKoiiStaked={totalStake}
                currentTopStake={topStake}
                myCurrentStake={myStake}
                state={state}
                myTotalRewards={myTotalRewards}
              />
            </div>

            <div className="pl-6 mt-16">
              <Button
                onClick={handleWithdraw}
                label="Withdraw Stake"
                variant="danger"
                className="bg-finnieGray-secondary text-finnieBlue"
              />
            </div>
          </>
        )}
        {currentView === 'SourceCode' && (
          <div className="select-text">
            <SourceCode sourceCode={exampleSourceCode} />
          </div>
        )}
      </div>
    </div>
  );
};
