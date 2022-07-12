import React, { memo, useCallback } from 'react';

import BackIcon from 'svgs/back-icon-white.svg';
import { Button } from 'webapp/components/ui/Button';

import { Tab } from '../Settings';

type PropsType = {
  onTabChange: (tab: Tab) => void;
  activeTab: Tab;
  onBackButtonClick: () => void;
};

const SettingsHeader = ({
  onBackButtonClick,
  onTabChange,
  activeTab,
}: PropsType) => {
  const isActiveTab = useCallback(
    (tabName: Tab) => activeTab === tabName && 'border-finnieTeal border-b-4',
    [activeTab]
  );

  return (
    <div className="flex items-center px-3 py-3 mb-6 text-white bg-finnieTeal bg-opacity-30 gap-7">
      <Button
        onlyIcon
        icon={<BackIcon className="cursor-pointer" />}
        onClick={onBackButtonClick}
      />
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
