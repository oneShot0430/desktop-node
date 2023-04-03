import { TooltipChatQuestionLeftLine, Icon } from '@_koii/koii-styleguide';
import React from 'react';

import { RequirementTag } from 'models/task';
import { Tooltip } from 'renderer/components/ui';
import { NodeTools } from 'renderer/features/node-tools';

type PropsType = {
  taskVariables?: RequirementTag[];
  taskPubKey: string;
  onToolsValidation?: (isValid: boolean) => void;
};

export function TaskSettings({
  taskVariables,
  taskPubKey,
  onToolsValidation,
}: PropsType) {
  return (
    <div className="flex flex-col w-full">
      <div className="flex gap-1 mb-4 text-sm font-semibold">
        CONFIGURE YOUR TASK SETTINGS
        <Tooltip
          placement="right"
          tooltipContent="Task settings are additional integrations from other tools necessary to run the task"
        >
          <Icon size={14} source={TooltipChatQuestionLeftLine} />
        </Tooltip>
      </div>

      {!!taskVariables?.length && (
        <NodeTools
          tools={taskVariables}
          taskPubKey={taskPubKey}
          onToolsValidation={onToolsValidation}
        />
      )}
    </div>
  );
}
