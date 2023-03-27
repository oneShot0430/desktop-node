import React, { useState } from 'react';
import { useQuery, useQueryClient } from 'react-query';

import { DEFAULT_K2_NETWORK_URL } from 'config/node';
import { useConfirmNetworkSwitchModal } from 'renderer/features/common/hooks';
import { QueryKeys, getNetworkUrl, switchNetwork } from 'renderer/services';

import { SettingSwitch } from './SettingSwitch';

export function NodeSettings() {
  const [hasFlippedSwitch, setHasFlippedSwitch] = useState(false);
  const queryClient = useQueryClient();

  const { data: networkUrl, isLoading: isLoadingNetworkUrl } = useQuery(
    QueryKeys.GetNetworkUrl,
    getNetworkUrl
  );

  const toggleNetwork = () => {
    setHasFlippedSwitch((switchState) => !switchState);
    showModal();
  };

  const confirmSwitchNetwork = async () => {
    await switchNetwork();
    setHasFlippedSwitch((switchState) => !switchState);
    queryClient.invalidateQueries(QueryKeys.GetNetworkUrl);
  };

  const { showModal } = useConfirmNetworkSwitchModal({
    onConfirm: confirmSwitchNetwork,
    onCancel: () => setHasFlippedSwitch(false),
  });

  const isNetworkChecked = !hasFlippedSwitch
    ? networkUrl !== DEFAULT_K2_NETWORK_URL
    : networkUrl === DEFAULT_K2_NETWORK_URL;

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
    </div>
  );
}
