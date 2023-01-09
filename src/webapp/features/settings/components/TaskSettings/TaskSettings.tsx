import React, { memo } from 'react';

import { AddTaskVariable, ManageYourTools } from '.';

export const TaskSettings = memo(() => (
  <div className="flex flex-col gap-10 text-white flex-grow min-h-0 ">
    <AddTaskVariable />
    <div className="h-px bg-white w-full" />
    <ManageYourTools />
  </div>
));

TaskSettings.displayName = 'TaskSettings';
