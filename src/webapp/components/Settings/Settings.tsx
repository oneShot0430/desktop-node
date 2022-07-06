import React, { memo, useCallback, useState } from 'react';

import BackIcon from 'svgs/back-icon-white.svg';

import { Button } from '../ui/Button';

import KeyManagementTable from './components/KeyManagementTable';
import NodeLogs from './components/NodeLogs';
import { AccountType } from './types';

const accountsMock: AccountType[] = [
  { name: 'Name', address: '12345xx', balance: 12345 },
];

enum Tab {
  KeyManagement = 'KeyManagement',
  NodeLogs = 'NodeLogs',
}

const Settings = () => {
  const [tab, setTab] = useState(Tab.KeyManagement);
  const handleBackButtonClick = () => {
    // TODO: navigate to previous page
  };

  const isActiveTab = useCallback(
    (tabName: Tab) => tab === tabName && 'border-finnieTeal border-b-4',
    [tab]
  );

  return (
    <div>
      <div className="flex items-center px-3 py-3 mb-6 text-white bg-finnieTeal bg-opacity-30 gap-7">
        <Button
          onlyIcon
          icon={<BackIcon className="cursor-pointer" />}
          onClick={handleBackButtonClick}
        />
        <div className="flex items-center gap-[109px]">
          <div
            className={`pb-[1px] ${isActiveTab(Tab.KeyManagement)}`}
            onClick={() => setTab(Tab.KeyManagement)}
          >
            Key Management
          </div>
          <div
            onClick={() => setTab(Tab.NodeLogs)}
            className={`pb-[1px] ${isActiveTab(Tab.NodeLogs)}`}
          >
            Node Logs
          </div>
        </div>
      </div>

      {tab === Tab.KeyManagement && (
        <KeyManagementTable accounts={accountsMock} />
      )}
      {tab === Tab.NodeLogs && <NodeLogs />}
    </div>
  );
};

export default memo(Settings);
