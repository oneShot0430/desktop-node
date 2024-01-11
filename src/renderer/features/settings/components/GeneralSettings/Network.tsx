import React, { useState } from 'react';
import { useQuery, useQueryClient } from 'react-query';

import { EMERGENCY_TESTNET_RPC_URL, TESTNET_RPC_URL } from 'config/node';
import { Tooltip } from 'renderer/components/ui/Tooltip';
import { useConfirmNetworkSwitchModal } from 'renderer/features/common/hooks';
import { QueryKeys, getNetworkUrl, switchNetwork } from 'renderer/services';

import { SettingSwitch } from '../MainSettings/SettingSwitch';

export function Network() {
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

  const isTestnet =
    networkUrl === TESTNET_RPC_URL || networkUrl === EMERGENCY_TESTNET_RPC_URL;

  const { showModal } = useConfirmNetworkSwitchModal({
    onConfirm: confirmSwitchNetwork,
    onCancel: () => setHasFlippedSwitch(false),
    newNetwork: isTestnet ? 'Devnet' : 'Testnet',
  });

  const isNetworkChecked = !hasFlippedSwitch ? !isTestnet : isTestnet;
  const tooltipContent = 'MAINNET is coming in Q2 2023';
  return (
    <Tooltip tooltipContent={tooltipContent} placement="bottom-left">
      <div className="flex flex-col gap-5">
        <SettingSwitch
          id="network"
          isLoading={isLoadingNetworkUrl}
          isChecked={isNetworkChecked}
          onSwitch={toggleNetwork}
          labels={['TESTNET', 'MAINNET']}
          isDisabled
        />
      </div>
    </Tooltip>
  );
}
