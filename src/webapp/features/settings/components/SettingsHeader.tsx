import React, { memo, useCallback } from 'react';

import { Tab } from '../Settings';

type PropsType = {
  onTabChange: (tab: Tab) => void;
  activeTab: Tab;
};

const SettingsHeader = ({ onTabChange, activeTab }: PropsType) => {
  const isActiveTab = useCallback(
    (tabName: Tab) => activeTab === tabName && 'border-finnieTeal border-b-4',
    [activeTab]
  );

  return (
    <div className="flex items-center px-3 py-3 mb-6 text-white bg-finnieTeal bg-opacity-30 gap-7">
      <div className="flex items-center gap-[109px]">
        <div
          className={`pb-[1px] ${isActiveTab(Tab.KeyManagement)}`}
          onClick={() => onTabChange(Tab.KeyManagement)}
        >
          Key Management
        </div>
        <div
          onClick={() => onTabChange(Tab.NodeLogs)}
          className={`pb-[1px] ${isActiveTab(Tab.NodeLogs)}`}
        >
          Node Logs
        </div>
      </div>
    </div>
  );
};

export default memo(SettingsHeader);
