import {
  Icon,
  ViewShowLine,
  EditPencilLine,
  DeleteTrashXlLine,
} from '@_koii/koii-styleguide';
import React from 'react';

import DotsSvg from 'assets/svgs/dots.svg';
import { TaskVariableData } from 'models/api';
import { useTaskVariable } from 'webapp/features/common/hooks';
import { useDeleteTaskVariable } from 'webapp/features/common/hooks/useDeleteTaskVariable';

export const ManageYourTools = () => {
  const { storedTaskVariables } = useTaskVariable();

  const arrayOfStoredVariables = Object.values(storedTaskVariables);

  return (
    <div className="flex flex-col gap-4 text-sm flex-grow min-h-0 ">
      <span className="text-2xl font-semibold text-left">
        Manage your Tools
      </span>

      <div className="flex flex-col gap-5 flex-grow min-h-0 overflow-y-auto">
        {arrayOfStoredVariables.map((taskVariable) => (
          <TaskVariableItem
            key={taskVariable.label}
            taskVariable={taskVariable}
          />
        ))}
      </div>
    </div>
  );
};

const TaskVariableItem = ({
  taskVariable: { label },
}: {
  taskVariable: TaskVariableData;
}) => {
  const { showModal } = useDeleteTaskVariable(label);

  return (
    <div className="flex items-center">
      <Icon source={DotsSvg} className="h-5" />
      <div className="px-6 py-2 mr-6 text-sm rounded-md bg-finnieBlue-light-tertiary w-80">
        {label}
      </div>

      <Icon source={ViewShowLine} className="h-3.5 mx-2 cursor-pointer" />
      <Icon source={EditPencilLine} className="h-4 mx-2 cursor-pointer" />
      <Icon
        source={DeleteTrashXlLine}
        className="h-5 mx-2 text-finnieRed cursor-pointer"
        onClick={showModal}
      />
    </div>
  );
};
