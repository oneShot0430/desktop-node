import React, { memo, useState } from 'react';

import { AccountsTable, NodeLogs, SettingsHeader } from './components';
import { logsMock } from './mocks';

export enum Tab {
  AccountsTable = 'AccountsTable',
  NodeLogs = 'NodeLogs',
}

const Settings = () => {
  const [selectedTab, setTab] = useState(Tab.AccountsTable);

  return (
    <div className="flex flex-col h-full">
      <SettingsHeader onTabChange={setTab} activeTab={selectedTab} />
      {selectedTab === Tab.AccountsTable && <AccountsTable />}
      {selectedTab === Tab.NodeLogs && <NodeLogs logs={logsMock} />}
    </div>
  );
};

export default memo(Settings);
