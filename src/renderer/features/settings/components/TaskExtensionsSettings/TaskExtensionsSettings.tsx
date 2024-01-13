import React from 'react';

import { SectionHeader } from '../SectionHeader';
import { Spacer } from '../Spacer';
import { AddTaskVariable, ManageYourTools } from '../TaskSettings';

export function TaskExtensionsSettings() {
  return (
    <div className="overflow-y-auto text-white">
      <SectionHeader title="Task Extensions" />
      <AddTaskVariable />
      <Spacer showSeparator />
      <div className="flex flex-col gap-6 xl:flex-row xl:gap-20">
        <ManageYourTools />
        {/*
          TODO: ReEnable in RELEASE_0.3.7
          <AddOnsList /> 
        */}
      </div>
    </div>
  );
}
