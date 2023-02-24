import { TooltipChatQuestionLeftLine, Icon } from '@_koii/koii-styleguide';
import React from 'react';

import { RequirementTag } from 'models/task';
import { NodeTools } from 'renderer/features/node-tools';

type PropsType = {
  settings?: RequirementTag[];
  taskPubKey: string;
  onToolsValidation?: (isValid: boolean) => void;
};

export function TaskSettings({
  settings,
  taskPubKey,
  onToolsValidation,
}: PropsType) {
  return (
    <div className="flex flex-col w-full">
      <div className="flex gap-1 mb-4 text-sm font-semibold uppercase">
        Configure Your task settings
        <Icon size={14} source={TooltipChatQuestionLeftLine} />
      </div>
      <NodeTools
        tools={settings}
        taskPubKey={taskPubKey}
        onToolsValidation={onToolsValidation}
      />
    </div>
  );
}
