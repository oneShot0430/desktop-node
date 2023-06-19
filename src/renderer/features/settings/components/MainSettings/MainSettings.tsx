import React from 'react';
import { useQuery } from 'react-query';

import { QueryKeys, getVersion } from 'renderer/services';

import { AutoUpdates } from './AutoUpdates';
import { Network } from './Network';
import { NodeLogs } from './NodeLogs';
import { Referral } from './Referral';
import { ReportBug } from './ReportBug';
import { SwitchWrapper } from './SwitchWrapper';

export function MainSettings() {
  const { data: appVersion = '' } = useQuery(QueryKeys.AppVersion, getVersion);

  return (
    <div className="flex flex-col h-full gap-6 text-sm text-white">
      <Referral />
      <div className="flex justify-start gap-4">
        <SwitchWrapper
          title="Choose Network"
          switchComponentSlot={<Network />}
        />
        <SwitchWrapper
          title="Automatic Updates"
          switchComponentSlot={<AutoUpdates />}
        />
      </div>

      <NodeLogs />

      <div className="flex justify-between w-full mt-2">
        <div className="mt-4">Version {appVersion}</div>
        <ReportBug />
      </div>
    </div>
  );
}
