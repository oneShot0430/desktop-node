import {
  AddLine,
  TipGiveLine,
  WebCursorXlLine,
  Icon,
} from '@_koii/koii-styleguide';
import * as React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

import {
  useCreateTaskModal,
  useFundNewAccountModal,
} from 'webapp/features/common';
import { AppRoute } from 'webapp/types/routes';

export function Actions() {
  const navigate = useNavigate();
  const location = useLocation();
  const { showModal: showFundModal } = useFundNewAccountModal();

  const isAddTaskView = location.pathname === AppRoute.AddTask;
  const { showModal: showCreateTaskModal } = useCreateTaskModal();

  const navigateToAvailableTasks = () => navigate(AppRoute.AddTask);

  const handleAddFundsClick = () => {
    showFundModal();
  };

  return (
    <div className="flex flex-col gap-4">
      {isAddTaskView ? (
        <button
          onClick={showCreateTaskModal}
          className="flex gap-2.5 flex-col items-center justify-center rounded bg-finnieOrange w-[186px] h-[108px] text-finnieBlue-light-secondary"
        >
          <div>
            <Icon source={WebCursorXlLine} className="m-auto h-9 w-9" />
          </div>
          <div>Create New Task</div>
        </button>
      ) : (
        <button
          onClick={navigateToAvailableTasks}
          className="flex gap-2.5 flex-col items-center justify-center rounded bg-finnieTeal w-[186px] h-[108px] text-finnieBlue-light-secondary"
        >
          <div>
            <Icon source={AddLine} className="m-auto h-9 w-9" />
          </div>
          <div>Add Task</div>
        </button>
      )}

      <button
        onClick={handleAddFundsClick}
        className="flex gap-2.5 flex-col items-center justify-center rounded bg-finnieBlue-light-secondary w-[186px] h-[108px] text-white"
      >
        <div>
          <Icon source={TipGiveLine} className="m-auto h-9 w-9" />
        </div>
        <div>Add Funds</div>
      </button>
    </div>
  );
}
