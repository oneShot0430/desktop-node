import { create, useModal } from '@ebay/nice-modal-react';
import React, { useState } from 'react';
import { useQuery } from 'react-query';

import ExternalSourceIconSvg from 'assets/svgs/external-source-icon-white.svg';
import FlagIconTealSvg from 'assets/svgs/flag-teal-icon.svg';
import CloseIcon from 'svgs/close-icons/close-icon-white.svg';
import { Button } from 'webapp/components/ui/Button';
import { useEarnedReward } from 'webapp/features/common/hooks/useEarnedReward';
import { Modal, ModalContent } from 'webapp/features/modals';
import { QueryKeys, TaskService, TaskStatusToLabeMap } from 'webapp/services';
import { Task } from 'webapp/types';

import SourceCode from './SourceCode';
import { TaskDetails } from './TaskDetails';

export type TaskDetailsModalPropsType = {
  task: Task;
  publicKey: string;
};

// type TabsType = TabsType.TaskDetails | TabsType.SourceCode;

enum TabsType {
  TaskDetails,
  SourceCode,
}

export const TaskDetailsModal = create<TaskDetailsModalPropsType>(
  function TaskDetailsModal({ task, publicKey }) {
    const modal = useModal();
    const [currentView, setCurrentView] = useState<TabsType>(
      TabsType.TaskDetails
    );

    const { earnedReward } = useEarnedReward({ task, publicKey });

    const { data: sourceCode } = useQuery(
      [QueryKeys.taskSourceCode, task.publicKey],
      () => TaskService.getTaskSourceCode(task)
    );

    const totalStake = TaskService.getTotalStaked(task);
    const nodes = TaskService.getNodesCount(task);
    const topStake = TaskService.getTopStake(task);
    const state = TaskStatusToLabeMap[TaskService.getStatus(task)];

    const { data: myStake } = useQuery(
      [QueryKeys.myStake, task.publicKey],
      () => TaskService.getMyStake(task)
    );

    const handleWithdraw = () => {
      console.log('Wthdraw action');
    };

    const handleClose = () => {
      modal.remove();
    };

    const activeClasses = 'border-b-2 border-finnieEmerald-light';

    return (
      <Modal>
        <ModalContent theme="dark" className="text-white w-[900px] h-[480px]">
          <div className="flex flex-col h-full px-8 py-6">
            <div className="flex justify-between">
              <div className="flex justify-start gap-6 pl-6 mb-5">
                <div
                  className={`${
                    currentView === TabsType.TaskDetails && activeClasses
                  } text-semibold`}
                  onClick={() => setCurrentView(TabsType.TaskDetails)}
                >
                  Task Details
                </div>
                <div
                  className={`${
                    currentView === TabsType.SourceCode && activeClasses
                  } text-semibold`}
                  onClick={() => setCurrentView(TabsType.SourceCode)}
                >
                  Source Code
                </div>
              </div>

              <CloseIcon
                data-testid="close-modal-button"
                onClick={handleClose}
                className="w-[24px] h-[24px] cursor-pointer"
              />
            </div>

            <div className="flex items-center mb-5 w-[100%]">
              <div className="cursor-pointer">
                <FlagIconTealSvg />
              </div>
              <div className="pl-[14px] pr-[14px]">
                Inspect{' '}
                <span className="text-finnieEmerald-light">
                  {task.taskName}
                </span>{' '}
                Source Code
              </div>
              {/*TODO: handle open in the browser window */}
              {currentView === TabsType.SourceCode && (
                <a
                  className="cursor-pointer"
                  target="_blank"
                  href={`https://viewblock.io/arweave/tx/${task.taskAuditProgram}`}
                  rel="noreferrer"
                >
                  <ExternalSourceIconSvg />
                </a>
              )}
            </div>

            <div className="overflow-y-auto">
              {currentView === TabsType.TaskDetails && (
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
                      myTotalRewards={earnedReward}
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
              {currentView === TabsType.SourceCode && (
                <div className="select-text ">
                  <SourceCode sourceCode={sourceCode} />
                </div>
              )}
            </div>
          </div>
        </ModalContent>
      </Modal>
    );
  }
);
