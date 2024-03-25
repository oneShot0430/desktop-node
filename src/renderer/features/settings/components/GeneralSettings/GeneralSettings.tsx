import React from 'react';

import { SwitchWrapper } from '../MainSettings/SwitchWrapper';
import { SectionHeader } from '../SectionHeader';
import { Spacer } from '../Spacer';

import { AutoUpdates } from './AutoUpdates';
import { ForceNodeUpdate } from './ForceNodeUpdate';
import { ForceRedeemMigrationTokens } from './ForceRedeemMigrationTokens';
import { LaunchOnRestart } from './LaunchOnRestart';
import { Network } from './Network';
import { NodeLogsSettingsSection } from './NodeLogs';
import { StayAwake } from './StayAwake';

export function GeneralSettings() {
  return (
    <div className="overflow-y-auto text-white">
      <SectionHeader title="General Settings" />
      <div className="flex flex-wrap gap-4">
        <SwitchWrapper
          title="Choose Network"
          switchComponent={Network}
          className="w-[280px]"
        />
        <SwitchWrapper
          title="Automatic Updates"
          switchComponent={AutoUpdates}
          className="w-[280px]"
        />
        <SwitchWrapper
          title="Stay Awake"
          switchComponent={StayAwake}
          className="w-[280px]"
        />
        <SwitchWrapper
          title="Launch on Restart"
          switchComponent={LaunchOnRestart}
          className="w-[280px]"
        />
      </div>
      <Spacer showSeparator />
      <NodeLogsSettingsSection />
      <Spacer showSeparator />
      <div className="flex justify-between w-full">
        <ForceRedeemMigrationTokens />
        <ForceNodeUpdate />
      </div>
    </div>
  );
}
