import React, { memo, useState } from 'react';

import { TasksScheduler } from '../tasks-scheduler';

import {
  AccountsTable,
  SettingsHeader,
  TaskSettings,
  MainSettings,
} from './components';
import { Tab } from './types';

function Settings() {
  const [selectedTab, setTab] = useState(Tab.MainSettings);

  const SettingsSection = {
    [Tab.AccountsTable]: AccountsTable,
    [Tab.TaskSettings]: TaskSettings,
    [Tab.MainSettings]: MainSettings,
    [Tab.TasksScheduler]: TasksScheduler,
  }[selectedTab];

  return (
    <div className="flex flex-col h-full">
      <SettingsHeader onTabChange={setTab} activeTab={selectedTab} />
      <SettingsSection />
    </div>
  );
}

export default memo(Settings);
