import clsx from 'clsx';
import React, { useEffect, useRef, useState } from 'react';

import CloseIcon from 'svgs/close-icons/close-icon-white.svg';
import { useAppDispatch, useAppSelector } from 'webapp/hooks/reduxHook';
import { showModal } from 'webapp/store/actions/modal';
import { closeTaskInspector } from 'webapp/store/actions/taskInspector';

import { ReportTaskView } from './ReportTaskView';
import SourceCodeView from './SourceCodeView';
import TaskDetailView from './TaskDetailView';

type Tab = 'DETAIL' | 'SOURCE_CODE';

const ModalTaskInspector = (): JSX.Element => {
  const [currentTab, setCurrentTab] = useState<Tab>('DETAIL');
  const [showReportView, setShowReportView] = useState(false);

  const taskInfo = useAppSelector((state) => state.taskInspector.task);
  const isShowingWidthdraw = useAppSelector((state) => state.modal.isShown);

  const modalRef = useRef<HTMLDivElement>(null);

  const dispatch = useAppDispatch();
  const close = () => dispatch(closeTaskInspector());

  const openReportView = () => setShowReportView(true);
  const closeReportView = () => setShowReportView(false);

  useEffect(() => {
    const handleClickOutSide = (e: Event) => {
      if (
        modalRef.current &&
        !modalRef.current.contains(e.target as Node) &&
        !isShowingWidthdraw
      ) {
        close();
      }
    };

    document.addEventListener('mousedown', handleClickOutSide);

    return () => document.removeEventListener('mousedown', handleClickOutSide);
  }, [modalRef, isShowingWidthdraw]);

  const showWithdraw = () => dispatch(showModal('WITHDRAW_STAKE', taskInfo));

  return (
    <>
      <div className="absolute top-0 left-0 z-20 flex items-center justify-center w-screen h-screen bg-black bg-opacity-40">
        <div
          ref={modalRef}
          className={clsx(
            currentTab === 'DETAIL' ? 'h-108.25' : 'h-144.75',
            'flex'
          )}
        >
          <div
            className={clsx(
              showReportView ? 'w-151.25' : 'w-249.75',
              showReportView && 'transform animate-shrink',
              'z-30 min-h-108.25 relative finnie-border-white rounded shadow-lg bg-finnieBlue pt-2.75 text-center',
              'flex flex-col items-start pl-12 tracking-finnieSpacing-wider pr-5 pb-6'
            )}
          >
            <CloseIcon
              data-testid="close-modal-button"
              onClick={close}
              className="absolute w-6 h-6 cursor-pointer top-2 right-2"
            />
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
              <TaskDetailView
                task={taskInfo}
                showWithdraw={showWithdraw}
                openReportView={openReportView}
              />
            )}

            {currentTab === 'SOURCE_CODE' && (
              <SourceCodeView
                taskName={taskInfo.taskName}
                openReportView={openReportView}
              />
            )}
          </div>
          {showReportView && (
            <ReportTaskView
              taskName={taskInfo.taskName}
              closeReportView={closeReportView}
            />
          )}
        </div>
      </div>
    </>
  );
};

export default ModalTaskInspector;
