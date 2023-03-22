import React, { memo, useState } from 'react';

import { AccountsTable, SettingsHeader, TaskSettings } from './components';
import { Tab } from './types';

function Settings() {
  const [selectedTab, setTab] = useState(Tab.AccountsTable);

  return (
    <div className="flex flex-col h-full">
      <SettingsHeader onTabChange={setTab} activeTab={selectedTab} />
      {selectedTab === Tab.AccountsTable && <AccountsTable />}
      {selectedTab === Tab.TaskSettings && <TaskSettings />}
      {selectedTab === Tab.NetworkSettings && (
        <div>
          <button className="text-white">Toggle network</button>
        </div>
      )}
    </div>
  );
}

export default memo(Settings);
