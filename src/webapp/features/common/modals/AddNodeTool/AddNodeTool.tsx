import { create, useModal } from '@ebay/nice-modal-react';
import React, { ChangeEventHandler, useState } from 'react';
import { useQuery } from 'react-query';

import BrowserIcon from 'assets/svgs/browser-icon.svg';
import CloseIconWhite from 'assets/svgs/close-icons/close-icon-white.svg';
import { Button, ErrorMessage } from 'webapp/components';
import { Modal, ModalContent } from 'webapp/features/modals';
import { getStoredTaskVariables, QueryKeys } from 'webapp/services';
import { Theme } from 'webapp/types/common';

const baseInputClassName =
  'px-6 py-2 text-sm rounded-md bg-finnieBlue-light-tertiary focus:ring-2 focus:ring-finnieTeal focus:outline-none focus:bg-finnieBlue-light-secondary';

export const AddNodeTool = create(function AddNodeTool() {
  const [label, setLabel] = useState<string>('');
  const [labelError, setLabelError] = useState<string>('');
  const [toolKey, setToolKey] = useState<string>('');

  const { data: storedTaskVariables } = useQuery(
    QueryKeys.TaskVariables,
    getStoredTaskVariables
  );

  const modal = useModal();

  const handleAdd = async () => {
    //  TO DO: put here logic to add a new tool
    modal.remove();
  };

  const handleLabelChange: ChangeEventHandler<HTMLInputElement> = ({
    target: { value: label },
  }) => {
    setLabelError('');
    setLabel(label);
    const storedTaskVariablesLabels = Object.values(storedTaskVariables).map(
      ({ label }) => label
    );
    const enteredLabelIsDuplicate = storedTaskVariablesLabels?.some(
      (storedLabel) => storedLabel === label
    );
    if (enteredLabelIsDuplicate) {
      setLabelError('You already have a tool registered with that label');
    }
  };
  const handleToolKeyChange: ChangeEventHandler<HTMLInputElement> = ({
    target: { value: key },
  }) => {
    setToolKey(key);
  };

  return (
    <Modal>
      <ModalContent
        theme={Theme.Dark}
        className="text-left px-12 pt-3 pb-6 w-fit h-fit rounded text-white flex flex-col gap-6"
      >
        <div className="w-full flex justify-center items-center gap-4 text-2xl  font-semibold">
          <BrowserIcon width={48} height={48} />
          <span>Add a Node Tool</span>

          <CloseIconWhite
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
            value={toolKey}
            onChange={handleToolKeyChange}
            placeholder="Paste Tool here"
          />
        </div>

        <Button
          label="Add Node Tool"
          onClick={handleAdd}
          disabled={!!labelError || !label || !toolKey}
          className="m-auto font-semibold bg-finnieGray-tertiary text-finnieBlue-light w-56 h-12"
        />
      </ModalContent>
    </Modal>
  );
});
