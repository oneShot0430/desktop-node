import { TooltipChatQuestionLeftLine, Icon } from '@_koii/koii-styleguide';
import React from 'react';

import { TaskTools } from 'renderer/features/node-tools';

type PropsType = {
  taskPubKey: string;
  onToolsValidation?: (isValid: boolean) => void;
};

export function TaskSettings({ taskPubKey, onToolsValidation }: PropsType) {
  return (
    <div className="flex flex-col w-full">
      <div className="flex gap-1 mb-4 text-sm font-semibold uppercase">
        Configure Your task settings
        <Icon size={14} source={TooltipChatQuestionLeftLine} />
      </div>
      <TaskTools
        taskPubKey={taskPubKey}
        onToolsValidation={onToolsValidation}
      />
    </div>
  );
}
