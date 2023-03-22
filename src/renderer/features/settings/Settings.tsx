import React, { memo, useState } from 'react';

import { Toggle } from 'renderer/components/ui';

import { AccountsTable, SettingsHeader, TaskSettings } from './components';
import { Tab } from './types';

function Settings() {
  const [selectedTab, setTab] = useState(Tab.AccountsTable);
  const [checked, setChecked] = useState(false);

  const toggleNetwork = () => {
    setChecked((checked) => !checked);
    // window.main.switchNetwork();
  };

  return (
    <div className="flex flex-col h-full">
      <SettingsHeader onTabChange={setTab} activeTab={selectedTab} />
      {selectedTab === Tab.AccountsTable && <AccountsTable />}
      {selectedTab === Tab.TaskSettings && <TaskSettings />}
      {selectedTab === Tab.NetworkSettings && (
        <div className="flex flex-col gap-10 text-white">
          <span className="text-2xl font-semibold text-left">
            Choose Node Network
          </span>
          <div className="flex items-center gap-4">
            <span>TESTNET</span>
            <Toggle checked={checked} onChange={toggleNetwork} />
            <span>DEVNET</span>
          </div>
        </div>
      )}
    </div>
  );
}

export default memo(Settings);
