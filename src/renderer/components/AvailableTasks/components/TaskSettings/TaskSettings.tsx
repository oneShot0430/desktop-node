import { TooltipChatQuestionLeftLine, Icon } from '@_koii/koii-styleguide';
import React, { RefObject } from 'react';
import { twMerge } from 'tailwind-merge';

import { RequirementTag } from 'models/task';
import { Tooltip } from 'renderer/components/ui';
import { NodeTools } from 'renderer/features/node-tools';

type PropsType = {
  taskPubKey: string;
  onOpenAddTaskVariableModal: (
    dropdownRef: RefObject<HTMLButtonElement>,
    tool: string
  ) => void;
  taskVariables?: RequirementTag[];
  onToolsValidation?: (isValid: boolean) => void;
  onPairingSuccess: () => void;
  moveToTaskInfo?: () => void;
  wrapperClasses?: string;
};

export function TaskSettings({
  taskVariables,
  taskPubKey,
  onToolsValidation,
  onPairingSuccess,
  onOpenAddTaskVariableModal,
  moveToTaskInfo,
  wrapperClasses = '',
}: PropsType) {
  const outerClasses = twMerge('flex flex-col w-full h-fit', wrapperClasses);

  return (
    <div className={outerClasses}>
      <div className="flex items-center gap-2 mb-1 text-xs font-bold">
        TASK SETTING CONFIGURATION
        <Tooltip
          placement="right"
          tooltipContent="Task settings are additional integrations from other tools necessary to run the task"
        >
          <Icon size={20} source={TooltipChatQuestionLeftLine} />
        </Tooltip>
      </div>
      {moveToTaskInfo && (
        <div className="mb-4 font-normal">
          Check the{' '}
          <button
            className="underline text-finnieTeal"
            onClick={moveToTaskInfo}
          >
            task creator&apos;s instructions
          </button>{' '}
          for configuring settings.
        </div>
      )}

      <NodeTools
        tools={taskVariables}
        taskPubKey={taskPubKey}
        onToolsValidation={onToolsValidation}
        onPairingSuccess={onPairingSuccess}
        onOpenAddTaskVariableModal={onOpenAddTaskVariableModal}
      />
    </div>
  );
}
