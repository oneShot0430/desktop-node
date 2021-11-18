import React from 'react';

import NewTaskIcon from 'svgs/add-icons/add-icon.svg';
import ActionButton from 'webapp/components/ActionButton';

const AddTasksActionCenter = (): JSX.Element => {
  return (
    <div className="flex">
      <div className="flex flex-col bg-finnieBlue font-normal justify-center items-start w-71 h-27.5 pl-4 text-lg rounder shadow-md">
        <div>
          <span className="font-semibold">1. </span>Select new tasks to run.
        </div>
        <div>
          <span className="font-semibold">2. </span>Earn more KOII.
        </div>
      </div>
      <ActionButton logo={NewTaskIcon} name="New Task" variant="teal" />
    </div>
  );
};

export default AddTasksActionCenter;
