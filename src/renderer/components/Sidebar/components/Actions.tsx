import {
  AddLine,
  TipGiveLine,
  WebCursorXlLine,
  Icon,
} from '@_koii/koii-styleguide';
import * as React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

import { useFundNewAccountModal } from 'renderer/features/common';
import { AppRoute } from 'renderer/types/routes';

export function Actions() {
  const navigate = useNavigate();
  const location = useLocation();
  const { showModal: showFundModal } = useFundNewAccountModal();

  const isAddTaskView = location.pathname === AppRoute.AddTask;

  const navigateToMyNode = () => navigate(AppRoute.MyNode);
  const navigateToAvailableTasks = () => navigate(AppRoute.AddTask);

  const handleAddFundsClick = () => {
    showFundModal();
  };

  return (
    <div className="flex flex-col gap-4">
      <button
        onClick={isAddTaskView ? navigateToMyNode : navigateToAvailableTasks}
        className="flex gap-2.5 flex-col items-center justify-center rounded w-[186px] h-[108px] text-finnieBlue-light-secondary bg-finnieTeal"
      >
        <div>
          <Icon
            source={isAddTaskView ? WebCursorXlLine : AddLine}
            className="m-auto h-9 w-9"
          />
        </div>
        <div>{isAddTaskView ? 'My Node' : 'Add Task'}</div>
      </button>

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
