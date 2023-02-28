import { TooltipChatQuestionLeftLine, Icon } from '@_koii/koii-styleguide';
import React from 'react';

import { NodeTools } from 'renderer/features/node-tools';

type PropsType = {
  taskPubKey: string;
  onNodeToolsValidation?: (isValid: boolean) => void;
};

export function TaskSettings({ taskPubKey, onNodeToolsValidation }: PropsType) {
  const handleNodeToolsValidationCheck = (isValid: boolean) => {
    onNodeToolsValidation?.(isValid);
  };

  return (
    <div className="flex flex-col w-full">
      <div className="flex gap-1 mb-4 text-sm font-semibold uppercase">
        Configure Your task settings
        <Icon size={14} source={TooltipChatQuestionLeftLine} />
      </div>
      <NodeTools
        taskPubKey={taskPubKey}
        onNodeToolsValidation={handleNodeToolsValidationCheck}
      />
    </div>
  );
}
