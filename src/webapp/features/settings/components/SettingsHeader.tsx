import React, { useCallback } from 'react';

import { Tab } from '../types';

type PropsType = {
  onTabChange: (tab: Tab) => void;
  activeTab: Tab;
};

export const SettingsHeader = ({ onTabChange, activeTab }: PropsType) => {
  const isActiveTab = useCallback(
    (tabName: Tab) => activeTab === tabName && 'border-finnieTeal border-b-4',
    [activeTab]
  );

  return (
    <div className="flex items-center px-3 py-3 mb-6 text-white bg-finnieTeal bg-opacity-30 gap-7">
      <div className="flex items-center gap-[109px]">
        <div
          className={`pb-px cursor-pointer ${isActiveTab(Tab.AccountsTable)}`}
          onClick={() => onTabChange(Tab.AccountsTable)}
        >
          Key Management
        </div>
        <div
          className={`pb-px cursor-pointer ${isActiveTab(Tab.TaskSettings)}`}
          onClick={() => onTabChange(Tab.TaskSettings)}
        >
          Task Settings
        </div>
        <div
          onClick={() => onTabChange(Tab.NodeLogs)}
          className={`pb-px cursor-pointer ${isActiveTab(Tab.NodeLogs)}`}
        >
          Node Logs
        </div>
      </div>
    </div>
  );
};
