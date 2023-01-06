import { Icon, SettingsLine } from '@_koii/koii-styleguide';
import React from 'react';

import { Button, ErrorMessage } from 'webapp/components';
import { useTaskVariable } from 'webapp/features/common/hooks';

const baseInputClassName =
  'px-6 py-2 text-sm rounded-md bg-finnieBlue-light-tertiary focus:ring-2 focus:ring-finnieTeal focus:outline-none focus:bg-finnieBlue-light-secondary';

export const AddTaskVariable = () => {
  const {
    handleAddTaskVariable,
    handleLabelChange,
    handleToolKeyChange,
    label,
    labelError,
    value,
    errorStoringTaskVariable,
  } = useTaskVariable({});

  return (
    <div className="flex flex-col gap-4 text-sm">
      <span className="text-2xl font-semibold text-left">
        Add a Task Setting
      </span>

      <div className="flex gap-5">
        <div className="flex flex-col mr-4">
          <label className="mb-1 text-left">LABEL</label>
          <input
            className={`${baseInputClassName} w-56`}
            type="text"
            value={label}
            onChange={handleLabelChange}
            placeholder="Add Label"
          />
          <div className="h-12 -mb-10 -mt-2">
            {labelError && (
              <ErrorMessage className="text-xs" error={labelError} />
            )}
          </div>
        </div>

        <div className="flex flex-col w-full">
          <label className="mb-1 text-left">KEY INPUT</label>
          <input
            className={`${baseInputClassName} w-full`}
            type="text"
            value={value}
            onChange={handleToolKeyChange}
            placeholder="Paste Tool here"
          />
          <div className="h-12 -mb-10 -mt-2">
            {errorStoringTaskVariable && (
              <ErrorMessage
                error={errorStoringTaskVariable}
                className="text-xs"
              />
            )}
          </div>
        </div>

        <Button
          label="Add"
          icon={<Icon source={SettingsLine} className="w-5" />}
          onClick={handleAddTaskVariable}
          disabled={!!labelError || !label || !value}
          className="font-semibold bg-finnieGray-tertiary text-finnieBlue-light text-[14px] leading-[14px] min-w-[200px] h-9 self-end"
        />
      </div>
    </div>
  );
};
