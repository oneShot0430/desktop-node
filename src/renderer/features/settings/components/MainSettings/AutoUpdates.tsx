import React from 'react';

import { useUserAppConfig } from '../../hooks';

import { AutomaticUpdatesSwitch } from './AutomaticUpdatesSwitch';

export function Autoupdates() {
  const { userConfig, userConfigMutation, isMutating } = useUserAppConfig({});

  const autoUpdatesEnabled = userConfig?.autoUpdatesEnabled;

  return (
    <div className="flex flex-col gap-5">
      <AutomaticUpdatesSwitch
        id="autoupdates"
        isChecked={!!autoUpdatesEnabled}
        onSwitch={() => {
          const newAutoUpdatesEnabled = !autoUpdatesEnabled;

          userConfigMutation.mutate({
            settings: {
              autoUpdatesEnabled: newAutoUpdatesEnabled,
            },
          });
        }}
        labels={['OFF', 'ON']}
        disabled={isMutating}
      />
    </div>
  );
}
