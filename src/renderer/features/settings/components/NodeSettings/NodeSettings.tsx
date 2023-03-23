import React, { useState } from 'react';
import { useQuery, useQueryClient } from 'react-query';

import { DEFAULT_K2_NETWORK_URL } from 'config/node';
import { QueryKeys, getNetworkUrl, switchNetwork } from 'renderer/services';

import { SettingSwitch } from './SettingSwitch';

export function NodeSettings() {
  const queryClient = useQueryClient();
  const [filterTasks, setFilterTasks] = useState(false);

  const { data: networkUrl, isLoading: isLoadingNetworkUrl } = useQuery(
    QueryKeys.GetNetworkUrl,
    getNetworkUrl
  );

  const toggleNetwork = async () => {
    await switchNetwork();
    queryClient.invalidateQueries(QueryKeys.GetNetworkUrl);
  };

  const toggleFilterTasks = () => {
    setFilterTasks((filterTasks) => !filterTasks);
  };

  const isNetworkChecked = networkUrl !== DEFAULT_K2_NETWORK_URL;
  const isLoadingTaskFilters = false;

  return (
    <div className="flex flex-col gap-10 text-white">
      <span className="text-2xl font-semibold text-left">
        Choose Node Network
      </span>
      <SettingSwitch
        id="network"
        isLoading={isLoadingNetworkUrl}
        isChecked={isNetworkChecked}
        onSwitch={toggleNetwork}
        labels={['TESTNET', 'DEVNET']}
      />

      <span className="text-2xl font-semibold text-left">Task filters</span>
      <SettingSwitch
        id="task-filters"
        isLoading={isLoadingTaskFilters}
        isChecked={filterTasks}
        onSwitch={toggleFilterTasks}
        labels={['DEFAULT', 'SHOW ALL']}
      />
    </div>
  );
}
