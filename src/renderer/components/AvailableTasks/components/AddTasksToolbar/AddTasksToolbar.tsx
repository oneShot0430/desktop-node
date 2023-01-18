import React from 'react';

import AddTasksIcon from 'assets/svgs/toolbar-icons/add-tasks-icon.svg';
import Toolbar from 'renderer/components/Toolbar';

import AddTasksActionCenter from './AddTasksActionCenter';

const AddTasksToolbar = (): JSX.Element => {
  return (
    <div>
      <Toolbar
        logo={AddTasksIcon}
        title="Available Tasks"
        rightPart={<AddTasksActionCenter />}
      />
    </div>
  );
};

export default AddTasksToolbar;
