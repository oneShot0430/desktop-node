import React, { memo, useState } from 'react';

import KeyManagementTable from './components/KeyManagementTable';
import NodeLogs from './components/NodeLogs';
import SettingsHeader from './components/SettingsHeader';
import { accountsMock, logsMock } from './mocks';

export enum Tab {
  KeyManagement = 'KeyManagement',
  NodeLogs = 'NodeLogs',
}

const Settings = () => {
  const [selectedTab, setTab] = useState(Tab.KeyManagement);

  const handleBackButtonClick = () => {
    // TODO: navigate to previous page
  };

  return (
    <div className="h-[100%]">
      <div className="h-[100%] flex flex-col">
        <SettingsHeader
          onBackButtonClick={handleBackButtonClick}
          onTabChange={setTab}
          activeTab={selectedTab}
        />
        {selectedTab === Tab.KeyManagement && (
          <KeyManagementTable accounts={accountsMock} />
        )}
        {selectedTab === Tab.NodeLogs && <NodeLogs logs={logsMock} />}
      </div>
    </div>
  );
};

export default memo(Settings);
