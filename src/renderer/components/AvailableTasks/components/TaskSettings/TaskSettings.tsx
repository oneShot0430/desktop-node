import { TooltipChatQuestionLeftLine, Icon } from '@_koii/koii-styleguide';
import React, { RefObject } from 'react';

import { RequirementTag } from 'models/task';
import { Tooltip } from 'renderer/components/ui';
import { NodeTools } from 'renderer/features/node-tools';

type PropsType = {
  taskPubKey: string;
  onOpenAddTaskVariableModal: (
    dropdownRef: RefObject<HTMLButtonElement>
  ) => void;
  taskVariables?: RequirementTag[];
  onToolsValidation?: (isValid: boolean) => void;
  onPairingSuccess: () => void;
};

export function TaskSettings({
  taskVariables,
  taskPubKey,
  onToolsValidation,
  onPairingSuccess,
  onOpenAddTaskVariableModal,
}: PropsType) {
  return (
    <div className="flex flex-col w-full">
      <div className="flex gap-2 mb-4 text-xs font-semibold items-center">
        CONFIGURE YOUR TASK SETTINGS
        <Tooltip
          placement="right"
          tooltipContent="Task settings are additional integrations from other tools necessary to run the task"
        >
          <Icon size={20} source={TooltipChatQuestionLeftLine} />
        </Tooltip>
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
