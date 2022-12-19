import * as React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

import ActionAddIcon from 'assets/svgs/action-add-icon.svg';
import AddFundsIcon from 'assets/svgs/add-funds-icon.svg';
import WebIcon from 'assets/svgs/web-icon-blue.svg';
import {
  useCreateTaskModal,
  useFundNewAccountModal,
} from 'webapp/features/common';
import { AppRoute } from 'webapp/types/routes';

export const Actions = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { showModal: showFundModal } = useFundNewAccountModal();

  const isAddTaskView = location.pathname === AppRoute.AddTask;
  const { showModal: showCreateTaskModal } = useCreateTaskModal();

  const handleAddTaskClick = () => {
    isAddTaskView ? showCreateTaskModal() : navigate(AppRoute.AddTask);
  };

  const handleAddFundsClick = () => {
    showFundModal();
  };

  return (
    <div className="flex flex-col gap-4">
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
        onClick={handleAddFundsClick}
        className="flex gap-[10px] flex-col items-center justify-center rounded bg-finnieBlue-light-secondary w-[186px] h-[108px]"
      >
        <div>
          <AddFundsIcon />
        </div>
        <div className="text-white">Add Funds</div>
      </button>
    </div>
  );
};
