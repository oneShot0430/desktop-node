import React from 'react';
import { useQuery, useQueryClient } from 'react-query';

import { DEFAULT_K2_NETWORK_URL } from 'config/node';
import { LoadingSpinner, Toggle } from 'renderer/components/ui';
import { QueryKeys, getNetworkUrl, switchNetwork } from 'renderer/services';

export function NodeSettings() {
  const queryClient = useQueryClient();

  const { data: networkUrl, isLoading: isLoadingNetworkUrl } = useQuery(
    QueryKeys.GetNetworkUrl,
    getNetworkUrl
  );

  const toggleNetwork = async () => {
    await switchNetwork();
    queryClient.invalidateQueries(QueryKeys.GetNetworkUrl);
  };

  const isChecked = networkUrl !== DEFAULT_K2_NETWORK_URL;

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
          <Toggle checked={isChecked} onChange={toggleNetwork} />
        )}
        <span>DEVNET</span>
      </div>
    </div>
  );
}
