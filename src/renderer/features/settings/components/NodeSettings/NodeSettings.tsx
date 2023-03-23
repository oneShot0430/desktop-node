import React, { useState } from 'react';
import { useQuery, useQueryClient } from 'react-query';

import { DEFAULT_K2_NETWORK_URL } from 'config/node';
import { LoadingSpinner, Switch } from 'renderer/components/ui';
import { QueryKeys, getNetworkUrl, switchNetwork } from 'renderer/services';

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
      <div className="flex items-center gap-4">
        <span>TESTNET</span>
        {isLoadingNetworkUrl ? (
          <LoadingSpinner className="mx-2.5" />
        ) : (
          <Switch
            id="network"
            isChecked={isNetworkChecked}
            onSwitch={toggleNetwork}
          />
        )}
        <span>DEVNET</span>
      </div>

      <span className="text-2xl font-semibold text-left">Task filters</span>
      <div className="flex items-center gap-4">
        <span>DEFAULT</span>
        {isLoadingTaskFilters ? (
          <LoadingSpinner className="mx-2.5" />
        ) : (
          <Switch
            id="task-filter"
            isChecked={filterTasks}
            onSwitch={toggleFilterTasks}
          />
        )}
        <span>SHOW ALL</span>
      </div>
    </div>
  );
}
