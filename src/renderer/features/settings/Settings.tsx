import React, { memo, useState } from 'react';

import AccountsTable from './components/AccountsTable';
import NodeLogs from './components/NodeLogs';
import SettingsHeader from './components/SettingsHeader';
import { logsMock } from './mocks';
import { Tab } from './types';

function Settings() {
  const [selectedTab, setTab] = useState(Tab.AccountsTable);

  return (
    <div className="flex flex-col h-full">
      <SettingsHeader onTabChange={setTab} activeTab={selectedTab} />
      {selectedTab === Tab.AccountsTable && <AccountsTable />}
      {selectedTab === Tab.NodeLogs && <NodeLogs logs={logsMock} />}
    </div>
  );
}

export default memo(Settings);
