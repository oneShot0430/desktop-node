import React from 'react';

import { useConfirmModal } from 'renderer/features/shared';
import { appRelaunch } from 'renderer/services';

import { useUserAppConfig } from '../../hooks';
import { SwitchWithLoader } from '../GeneralSettings/AutomaticUpdatesSwitch';

export function SwitchForceNetworkTunneling() {
  const { userConfig, userConfigMutation, isMutating } = useUserAppConfig({
    onConfigSaveSuccess() {
      appRelaunch();
    },
  });

  const { showModal } = useConfirmModal({
    header: 'Toggle Network Tunneling',
    content:
      'By toggling Network Tunneling, you will cause the app to restart, \n\nare you sure?',
  });

  const forceNetworkTinneling = userConfig?.forceTunneling;

  return (
    <div className="flex flex-col gap-5">
      <SwitchWithLoader
        id="autoUpdates"
        isChecked={!!forceNetworkTinneling}
        onSwitch={async () => {
          const confirm = await showModal();

          if (confirm) {
            const forceTunneling = !forceNetworkTinneling;

            userConfigMutation.mutate({
              settings: {
                forceTunneling,
              },
            });
          } else {
            console.log('@@@@ confirm', confirm);
          }
        }}
        labels={['OFF', 'ON']} // Switched labels to match the new logic
        disabled={isMutating}
      />
    </div>
  );
}
