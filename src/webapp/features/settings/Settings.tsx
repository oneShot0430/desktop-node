import React, { memo, useState } from 'react';

import {
  AccountsTable,
  NodeLogs,
  SettingsHeader,
  TaskSettings,
} from './components';
import { logsMock } from './mocks';
import { Tab } from './types';

const Settings = () => {
  const [selectedTab, setTab] = useState(Tab.AccountsTable);

  return (
    <div className="flex flex-col h-full">
      <SettingsHeader onTabChange={setTab} activeTab={selectedTab} />
      {selectedTab === Tab.AccountsTable && <AccountsTable />}
      {selectedTab === Tab.TaskSettings && <TaskSettings />}
      {selectedTab === Tab.NodeLogs && <NodeLogs logs={logsMock} />}
    </div>
  );
};

export default memo(Settings);
