import clsx from 'clsx';
import React, { useEffect, useRef, useState } from 'react';

import CloseIcon from 'svgs/close-icons/close-icon-white.svg';
import ReportTaskIcon from 'svgs/flag-icon.svg';
import { useAppDispatch, useAppSelector } from 'webapp/hooks/reduxHook';
import { showModal } from 'webapp/store/actions/modal';
import { closeTaskInspector } from 'webapp/store/actions/taskInspector';

type Tab = 'DETAIL' | 'SOURCE_CODE';

const ModalTaskInspector = (): JSX.Element => {
  const [currentTab, setCurrentTab] = useState<Tab>('DETAIL');

  const isOpen = useAppSelector((state) => state.taskInpector.isShown);
  const taskInfo = useAppSelector((state) => state.taskInpector.task);

  const modalRef = useRef<HTMLDivElement>(null);

  const dispatch = useAppDispatch();
  const close = () => dispatch(closeTaskInspector());

  useEffect(() => {
    const handleClickOutSide = (e: Event) => {
      if (modalRef.current && !modalRef.current.contains(e.target as Node)) {
        close();
      }
    };

    document.addEventListener('mousedown', handleClickOutSide);

    return () => document.removeEventListener('mousedown', handleClickOutSide);
  }, [modalRef]);

  return (
    <>
      {isOpen && (
        <div className="z-20 absolute top-0 left-0 w-screen h-screen flex items-center justify-center bg-black bg-opacity-40">
          <div
            ref={modalRef}
            className="w-249.75 h-108.25 relative finnie-border-white rounded shadow-lg bg-finnieBlue pt-2.75 text-center"
          >
            <CloseIcon
              data-testid="close-modal-button"
              onClick={close}
              className="w-6 h-6 absolute top-2 right-2 cursor-pointer"
            />
            <div className="flex flex-col items-start pl-12 tracking-finnieSpacing-wider">
              <div className="flex h-4 w-41.25 justify-between text-white text-xs mb-8">
                <div
                  className={clsx(
                    currentTab === 'DETAIL' &&
                      'border-b-2 border-finnieTeal font-semibold',
                    'h-4 box-content cursor-pointer'
                  )}
                  onClick={() => setCurrentTab('DETAIL')}
                >
                  Details
                </div>
                <div
                  className={clsx(
                    currentTab === 'SOURCE_CODE' &&
                      'border-b-2 border-finnieTeal font-semibold',
                    'h-4 box-content cursor-pointer'
                  )}
                  onClick={() => setCurrentTab('SOURCE_CODE')}
                >
                  Source Code
                </div>
              </div>

              {currentTab === 'DETAIL' && (
                <>
                  <div className="relative flex font-semibold mb-5.5">
                    <ReportTaskIcon className="absolute top-1 -left-6.25 w-2.5 h-3.5" />
                    <div className="text-finnieEmerald">
                      {taskInfo.name}&nbsp;
                    </div>
                    <div className="text-white">Details</div>
                  </div>

                  <div className="flex text-sm mb-1">
                    <div className="text-white w-59.25 flex items-start leading-6">
                      Owner:
                    </div>
                    <div className="text-finnieTeal font-semibold">
                      {taskInfo.owner}
                    </div>
                  </div>

                  <div className="flex text-sm mb-1">
                    <div className="text-white w-59.25 flex items-start leading-6">
                      Total KOII bounty:
                    </div>
                    <div className="text-finnieTeal font-semibold">
                      {taskInfo.totalKOIIBounty}
                    </div>
                  </div>

                  <div className="flex text-sm mb-1">
                    <div className="text-white w-59.25 flex items-start leading-6">
                      Nodes participating:
                    </div>
                    <div className="text-finnieTeal font-semibold">
                      {taskInfo.nodesParticipating}
                    </div>
                  </div>

                  <div className="flex text-sm mb-1">
                    <div className="text-white w-59.25 flex items-start leading-6">
                      Total KOII staked:
                    </div>
                    <div className="text-finnieTeal font-semibold">
                      {taskInfo.totalKOIIStaked}
                    </div>
                  </div>

                  <div className="flex text-sm mb-1">
                    <div className="text-white w-59.25 flex items-start leading-6">
                      Current top stake:
                    </div>
                    <div className="text-finnieTeal font-semibold">
                      {taskInfo.currentTopStake}
                    </div>
                  </div>

                  <div className="flex text-sm mb-1">
                    <div className="text-white w-59.25 flex items-start leading-6">
                      My KOII staked:
                    </div>
                    <div className="text-finnieTeal font-semibold">
                      {taskInfo.myKOIIStaked}
                    </div>
                  </div>

                  <div className="flex text-sm mb-1">
                    <div className="text-white w-59.25 flex items-start leading-6">
                      State:
                    </div>
                    <div className="text-finnieTeal font-semibold">
                      {taskInfo.state}
                    </div>
                  </div>

                  <div className="flex text-sm mb-13">
                    <div className="text-white w-59.25 flex items-start leading-6">
                      My Rewards:
                    </div>
                    <div className="text-finnieTeal font-semibold">
                      {taskInfo.myRewards}
                    </div>
                  </div>

                  <button
                    className="bg-white w-44.75 h-8 rounded-finnie-small shadow-lg text-base font-semibold"
                    onClick={() =>
                      dispatch(
                        showModal('WITHDRAW_STAKE', {
                          name: taskInfo.name,
                          creator: taskInfo.owner,
                          rewardEarned: taskInfo.myRewards,
                        })
                      )
                    }
                  >
                    Withdraw Stake
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default ModalTaskInspector;
