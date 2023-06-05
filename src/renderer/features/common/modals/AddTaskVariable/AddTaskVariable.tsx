import { Icon, CloseLine, SettingsLine } from '@_koii/koii-styleguide';
import { create, useModal } from '@ebay/nice-modal-react';
import React, { useCallback } from 'react';

import { TaskVariableDataWithId } from 'models';
import { Button, ErrorMessage } from 'renderer/components/ui';
import { useTaskVariable } from 'renderer/features/common/hooks/useTaskVariable';
import { Modal, ModalContent } from 'renderer/features/modals';
import { useStoredTaskVariables } from 'renderer/features/node-tools';
import { Theme } from 'renderer/types/common';

const baseInputClassName =
  'px-6 py-2 text-sm rounded-md bg-finnieBlue-light-tertiary focus:ring-2 focus:ring-finnieTeal focus:outline-none focus:bg-finnieBlue-light-secondary';

interface Props {
  presetLabel: string;
}

export const AddTaskVariable = create(function AddTaskVariable({
  presetLabel,
}: Props) {
  const {
    storedTaskVariablesQuery: { refetch },
  } = useStoredTaskVariables();
  const modal = useModal();

  const onAddTaskVariableSucces = async () => {
    await refetch();
    modal.resolve(true);
    modal.remove();
  };

  const {
    handleAddTaskVariable,
    handleLabelChange,
    handleToolKeyChange,
    label,
    labelError,
    value,
    errorStoringTaskVariable,
    storingTaskVariable,
  } = useTaskVariable({
    onSuccess: onAddTaskVariableSucces,
    taskVariable: { label: presetLabel } as TaskVariableDataWithId,
  });

  const closeModal = useCallback(() => {
    modal.resolve(false);
    modal.remove();
  }, [modal]);

  return (
    <Modal>
      <ModalContent
        theme={Theme.Dark}
        className="text-left p-5 pl-10 w-max h-fit rounded text-white flex flex-col gap-4 min-w-[740px]"
      >
        <div className="w-full flex justify-center items-center gap-4 text-2xl font-semibold pt-2">
          <Icon source={SettingsLine} className="h-8 w-8" />
          <span>Add a Task Setting</span>
          <Icon
            source={CloseLine}
            className="h-8 w-8 ml-auto cursor-pointer"
            onClick={closeModal}
          />
        </div>

        <p className="mr-12">Add information about your Task Setting</p>
        <div className="flex flex-col mb-2">
          <label htmlFor="setting-label" className="mb-0.5 text-left">
            LABEL
          </label>
          <input
            id="setting-label"
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
          <label htmlFor="setting-input" className="mb-0.5 text-left">
            KEY INPUT
          </label>
          <input
            id="setting-input"
            className={`${baseInputClassName} w-full`}
            type="text"
            value={value}
            onChange={handleToolKeyChange}
            placeholder="Type key here"
          />
        </div>

        <div className="h-6 -mt-4 -mb-3 text-center">
          {errorStoringTaskVariable && (
            <ErrorMessage
              error={errorStoringTaskVariable}
              className="text-xs"
            />
          )}
        </div>

        <Button
          label="Save Settings"
          onClick={handleAddTaskVariable}
          disabled={!!labelError || !label || !value}
          className="m-auto font-semibold bg-finnieGray-tertiary text-finnieBlue-light w-56 h-12"
          loading={storingTaskVariable}
        />
      </ModalContent>
    </Modal>
  );
});
