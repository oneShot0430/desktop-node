import { Icon, CloseLine, BrowseInternetLine } from '@_koii/koii-styleguide';
import { create, useModal } from '@ebay/nice-modal-react';
import React from 'react';

import { Button, ErrorMessage } from 'renderer/components/ui';
import { useTaskVariable } from 'renderer/features/common/hooks/useTaskVariable';
import { Modal, ModalContent } from 'renderer/features/modals';
import { Theme } from 'renderer/types/common';

const baseInputClassName =
  'px-6 py-2 text-sm rounded-md bg-finnieBlue-light-tertiary focus:ring-2 focus:ring-finnieTeal focus:outline-none focus:bg-finnieBlue-light-secondary';

export const AddTaskVariable = create(function AddTaskVariable() {
  const modal = useModal();

  const {
    handleAddTaskVariable,
    handleLabelChange,
    handleToolKeyChange,
    label,
    labelError,
    value,
    errorStoringTaskVariable,
  } = useTaskVariable({ onSuccess: modal.remove });

  return (
    <Modal>
      <ModalContent
        theme={Theme.Dark}
        className="text-left px-12 pt-3 pb-6 w-max h-fit rounded text-white flex flex-col gap-6"
      >
        <div className="w-full flex justify-center items-center gap-4 text-2xl  font-semibold">
          <Icon source={BrowseInternetLine} className="w-9 h-9 m-2" />
          <span>Add a Node Tool</span>
          <Icon
            source={CloseLine}
            className="w-8 h-8 -mr-8 ml-auto cursor-pointer"
            onClick={modal.remove}
          />
        </div>

        <p className="mr-12">
          After you get the Tool, come back and enter it here. Make sure to add
          a descriptive
          <br /> label for future reference.
        </p>

        <div className="flex flex-col">
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

        <div className="flex flex-col">
          <label className="mb-0.5 text-left">TOOL KEY</label>
          <input
            className={`${baseInputClassName} w-full`}
            type="text"
            value={value}
            onChange={handleToolKeyChange}
            placeholder="Paste Tool here"
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
          label="Add Node Tool"
          onClick={handleAddTaskVariable}
          disabled={!!labelError || !label || !value}
          className="m-auto font-semibold bg-finnieGray-tertiary text-finnieBlue-light w-56 h-12"
        />
      </ModalContent>
    </Modal>
  );
});
