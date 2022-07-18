import * as React from 'react';
import { useDispatch } from 'react-redux';
import { useLocation, useNavigate } from 'react-router-dom';

import ActionAddIcon from 'assets/svgs/action-add-icon.svg';
import ActionHistoryIcon from 'assets/svgs/action-history-icon.svg';
import WebIcon from 'assets/svgs/web-icon-blue.svg';
import { AppRoute } from 'webapp/routing/AppRoutes';
import { showModal } from 'webapp/store/actions/modal';

export const Actions = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const isAddTaskView = location.pathname === AppRoute.AddTask;

  const handleAddTaskClick = () => {
    isAddTaskView
      ? dispatch(showModal('CREATE_TASK'))
      : navigate(AppRoute.AddTask);
  };

  const handleHistoryClick = () => {
    navigate(AppRoute.History);
  };

  return (
    <div className="flex flex-col gap-[26px]">
      {isAddTaskView ? (
        <button
          onClick={handleAddTaskClick}
          className="flex gap-[10px] flex-col items-center justify-center rounded bg-finnieOrange w-[186px] h-[108px]"
        >
          <div>
            <WebIcon />
          </div>
          <div className="text-finnieBlue-light-secondary">Create New Task</div>
        </button>
      ) : (
        <button
          onClick={handleAddTaskClick}
          className="flex gap-[10px] flex-col items-center justify-center rounded bg-finnieTeal w-[186px] h-[108px]"
        >
          <div>
            <ActionAddIcon />
          </div>
          <div className="text-finnieBlue-light-secondary">Add Task</div>
        </button>
      )}

      <button
        onClick={handleHistoryClick}
        className="flex gap-[10px] flex-col items-center justify-center rounded bg-finnieBlue-light-secondary w-[186px] h-[108px]"
      >
        <div>
          <ActionHistoryIcon />
        </div>
        <div className="text-white">History</div>
      </button>
    </div>
  );
};
