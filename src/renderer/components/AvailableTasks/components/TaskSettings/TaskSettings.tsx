import { TooltipChatQuestionLeftLine, Icon } from '@_koii/koii-styleguide';
import React, { RefObject } from 'react';

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
  moveToTaskInfo: () => void;
};

export function TaskSettings({
  taskVariables,
  taskPubKey,
  onToolsValidation,
  onPairingSuccess,
  onOpenAddTaskVariableModal,
  moveToTaskInfo,
}: PropsType) {
  return (
    <div className="flex flex-col w-full">
      <div className="flex gap-2 mb-1 text-xs font-bold items-center">
        TASK SETTING CONFIGURATION
        <Tooltip
          placement="right"
          tooltipContent="Task settings are additional integrations from other tools necessary to run the task"
        >
          <Icon size={20} source={TooltipChatQuestionLeftLine} />
        </Tooltip>
      </div>
      <div className="mb-4 font-normal">
        Check the{' '}
        <button className="text-finnieTeal underline" onClick={moveToTaskInfo}>
          task creator&apos;s instructions
        </button>{' '}
        for configuring settings.
      </div>

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
