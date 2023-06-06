import React from 'react';
import { useQuery } from 'react-query';

import { QueryKeys, getVersion } from 'renderer/services';

import { Autoupdates } from './AutoUpdates';
import { Network } from './Network';
import { NodeLogs } from './NodeLogs';
import { Referral } from './Referral';
import { ReportBug } from './ReportBug';
import { SwitchWrapper } from './SwitchWrapper';

export function MainSettings() {
  const { data: appVersion = '' } = useQuery(QueryKeys.AppVersion, getVersion);

  return (
    <div className="flex flex-col gap-6 text-white h-full text-sm">
      <Referral />
      <div className="flex justify-start gap-4">
        <SwitchWrapper
          title="Choose Network"
          switchComponentSlot={<Network />}
        />
        <SwitchWrapper
          title="Automatic Updates"
          switchComponentSlot={<Autoupdates />}
        />
      </div>

      <NodeLogs />

      <div className="mt-2 flex w-full justify-between">
        <div className="mt-4">Version {appVersion}</div>
        <ReportBug />
      </div>
    </div>
  );
}
