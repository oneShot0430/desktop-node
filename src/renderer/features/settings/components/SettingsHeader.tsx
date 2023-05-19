import React, { useCallback } from 'react';

import { Tab } from '../types';

const tabs = [
  {
    value: Tab.MainSettings,
    label: 'Settings',
  },
  {
    value: Tab.AccountsTable,
    label: 'Key Management',
  },
  {
    value: Tab.TaskSettings,
    label: 'Task Settings',
  },
];

type PropsType = {
  onTabChange: (tab: Tab) => void;
  activeTab: Tab;
};

export function SettingsHeader({ onTabChange, activeTab }: PropsType) {
  const isActiveTab = useCallback(
    (tabName: Tab) => activeTab === tabName && 'border-finnieTeal border-b-4',
    [activeTab]
  );

  return (
    <div className="flex items-center px-3 py-3 mb-6 text-white bg-finnieTeal bg-opacity-30 gap-7">
      <div className="flex items-center gap-[109px]">
        {tabs.map(({ value, label }) => (
          <button
            key={value}
            onClick={() => onTabChange(value)}
            className={`pb-px cursor-pointer ${isActiveTab(value)}`}
          >
            {label}
          </button>
        ))}
      </div>
    </div>
  );
}
