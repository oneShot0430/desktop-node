import {
  Icon,
  ViewShowLine,
  EditPencilLine,
  DeleteTrashXlLine,
} from '@_koii/koii-styleguide';
import React from 'react';

import DotsSvg from 'assets/svgs/dots.svg';
import { TaskVariableData } from 'models/api';
import {
  useDeleteTaskVariable,
  useEditTaskVariable,
} from 'webapp/features/common/hooks';

interface Props {
  taskVariable: TaskVariableData;
}

export const TaskVariableItem = ({ taskVariable }: Props) => {
  const { label } = taskVariable;
  const { showModal: showDeleteModal } = useDeleteTaskVariable(label);
  const { showModal: showEditModal } = useEditTaskVariable(taskVariable);

  return (
    <div className="flex items-center">
      <Icon source={DotsSvg} className="h-5" />
      <div className="px-6 py-2 mr-6 text-sm rounded-md bg-finnieBlue-light-tertiary w-80">
        {label}
      </div>

      <Icon source={ViewShowLine} className="h-3.5 mx-2 cursor-pointer" />
      <Icon
        source={EditPencilLine}
        className="h-4 mx-2 cursor-pointer"
        onClick={showEditModal}
      />
      <Icon
        source={DeleteTrashXlLine}
        className="h-5 mx-2 text-finnieRed cursor-pointer"
        onClick={showDeleteModal}
      />
    </div>
  );
};
