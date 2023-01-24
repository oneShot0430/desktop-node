import { Icon, CloseLine, SettingsLine } from '@_koii/koii-styleguide';
import { create, useModal } from '@ebay/nice-modal-react';
import React from 'react';

import { TaskVariableDataWithId } from 'models/api';
import { Button, ErrorMessage } from 'webapp/components';
import { useTaskVariable } from 'webapp/features/common/hooks';
import { Modal, ModalContent } from 'webapp/features/modals';
import { Theme } from 'webapp/types/common';

const baseInputClassName =
  'px-6 py-2 text-sm rounded-md bg-finnieBlue-light-tertiary focus:ring-2 focus:ring-finnieTeal focus:outline-none focus:bg-finnieBlue-light-secondary';

interface Params {
  taskVariable: TaskVariableDataWithId;
}

export const EditTaskVariable = create<Params>(function EditTaskVariable({
  taskVariable,
}) {
  const modal = useModal();

  const {
    handleEditTaskVariable,
    handleLabelChange,
    handleToolKeyChange,
    label,
    labelError,
    value,
    errorEditingTaskVariable,
  } = useTaskVariable({
    onSuccess: modal.remove,
    taskVariable,
  });

  return (
    <Modal>
      <ModalContent
        theme={Theme.Dark}
        className="text-left p-5 pl-10 w-max h-fit rounded text-white flex flex-col gap-4 min-w-[740px]"
      >
        <div className="w-full flex justify-center items-center gap-4 text-2xl font-semibold pt-2">
          <Icon source={SettingsLine} className="h-8 w-8" />
          <span>Edit a Task Setting</span>
          <Icon
            source={CloseLine}
            className="h-8 w-8 ml-auto cursor-pointer"
            onClick={modal.remove}
          />
        </div>

        <p className="mr-12">Edit information about your Task Setting</p>
        <div className="flex flex-col mb-2">
          <label className="mb-0.5 text-left">TOOL LABEL</label>
          <input
            className={`${baseInputClassName} w-56`}
            type="text"
            value={label}
            onChange={handleLabelChange}
            placeholder="Add Label"
          />
          <div className="h-12 -mb-10 -mt-2">
            {labelError && (
              <ErrorMessage error={labelError} className="text-xs" />
            )}
          </div>
        </div>

        <div className="flex flex-col mb-2">
          <label className="mb-0.5 text-left">TOOL KEY INPUT</label>
          <input
            className={`${baseInputClassName} w-full`}
            type="text"
            value={value}
            onChange={handleToolKeyChange}
            placeholder="Paste Tool here"
          />
        </div>

        <div className="h-6 -mt-4 -mb-3 text-center">
          {errorEditingTaskVariable && (
            <ErrorMessage
              error={errorEditingTaskVariable}
              className="text-xs"
            />
          )}
        </div>

        <Button
          label="Save Settings"
          onClick={handleEditTaskVariable}
          disabled={!!labelError || !label || !value}
          className="m-auto font-semibold bg-finnieGray-tertiary text-finnieBlue-light w-56 h-12"
        />
      </ModalContent>
    </Modal>
  );
});
