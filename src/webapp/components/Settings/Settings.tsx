import React, { memo, useState } from 'react';

import KeyManagementTable from './components/KeyManagementTable';
import NodeLogs from './components/NodeLogs';
import SettingsHeader from './components/SettingsHeader';
import { logsMock } from './mocks';

export enum Tab {
  KeyManagement = 'KeyManagement',
  NodeLogs = 'NodeLogs',
}

const Settings = () => {
  const [selectedTab, setTab] = useState(Tab.KeyManagement);

  return (
    <div className="flex flex-col">
      <SettingsHeader onTabChange={setTab} activeTab={selectedTab} />
      {selectedTab === Tab.KeyManagement && <KeyManagementTable />}
      {selectedTab === Tab.NodeLogs && <NodeLogs logs={logsMock} />}
    </div>
  );
};

export default memo(Settings);
