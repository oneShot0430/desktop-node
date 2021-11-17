import React from 'react';

import AddTasksIcon from 'svgs/toolbar-icons/add-tasks-icon.svg';
import Toolbar from 'webapp/components/Toolbar';

import AddTasksActionCenter from './AddTasksActionCenter/AddTasksActionCenter';

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
