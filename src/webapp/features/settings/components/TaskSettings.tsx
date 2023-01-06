import React, { memo } from 'react';

import { AddTaskVariable } from './AddTaskVariable';

export const TaskSettings = memo(() => (
  <div className="flex flex-col gap-10 text-white">
    <AddTaskVariable />
  </div>
));

TaskSettings.displayName = 'TaskSettings';
