import { TooltipChatQuestionLeftLine, Icon } from '@_koii/koii-styleguide';
import React from 'react';

import { NodeTools } from 'features/node-tools';

type PropsType = {
  taskPubKey: string;
};

export const TaskSettings = ({ taskPubKey }: PropsType) => {
  return (
    <div className="flex flex-col w-full">
      <div className="mb-4 font-semibold uppercase">
        Configure Your task settings
        <Icon source={TooltipChatQuestionLeftLine} />
      </div>
      <NodeTools taskPubKey={taskPubKey} />
    </div>
  );
};
