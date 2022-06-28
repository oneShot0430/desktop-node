import * as React from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';

import ActionAddIcon from 'assets/svgs/action-add-icon.svg';
import ActionHistoryIcon from 'assets/svgs/action-history-icon.svg';
import { AppRoute } from 'webapp/routing/AppRoutes';
import { showModal } from 'webapp/store/actions/modal';

export const Actions = () => {
  const dispatch = useDispatch();
  const handleAddTaskClick = () => {
    dispatch(showModal('CREATE_TASK'));
  };

  const handleHistoryClick = () => {
    console.log('handle history click');
  };

  return (
    <div className="flex flex-col gap-[26px]">
      <button
        onClick={handleAddTaskClick}
        className="flex gap-[10px] flex-col items-center justify-center rounded bg-finnieTeal w-[186px] h-[108px]"
      >
        <div>
          <ActionAddIcon />
        </div>
        <div className="text-finnieBlue-light-secondary">Add Task</div>
      </button>

      <button className="flex gap-[10px] flex-col items-center justify-center rounded bg-finnieBlue-light-secondary w-[186px] h-[108px]">
        <div onClick={handleHistoryClick}>
          <ActionHistoryIcon />
        </div>
        <div className="text-white">History</div>
      </button>
    </div>
  );
};
