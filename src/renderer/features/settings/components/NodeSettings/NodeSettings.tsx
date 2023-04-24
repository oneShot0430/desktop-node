import React, { useState } from 'react';
import { useQuery, useQueryClient } from 'react-query';

import { TESTNET_RPC_URL } from 'config/node';
import { useConfirmNetworkSwitchModal } from 'renderer/features/common/hooks';
import { QueryKeys, getNetworkUrl, switchNetwork } from 'renderer/services';

import { SettingSwitch } from './SettingSwitch';

const lastCommitSha =
  (typeof process !== 'undefined' && process.env.COMMIT_SHA) || '';

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
    newNetwork: networkUrl === TESTNET_RPC_URL ? 'Devnet' : 'Testnet',
  });

  const isNetworkChecked = !hasFlippedSwitch
    ? networkUrl !== TESTNET_RPC_URL
    : networkUrl === TESTNET_RPC_URL;

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
      <div>version: {lastCommitSha}</div>
    </div>
  );
}
