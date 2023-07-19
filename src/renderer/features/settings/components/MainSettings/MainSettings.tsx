import React from 'react';
import { useQuery } from 'react-query';

import { Tooltip } from 'renderer/components/ui';
import { QueryKeys, getVersion } from 'renderer/services';
import { Theme } from 'renderer/types/common';

// import { AutoUpdates } from './AutoUpdates';
import { AutoUpdates } from './AutoUpdates';
import { Network } from './Network';
import { NodeLogs } from './NodeLogs';
import { Referral } from './Referral';
import { ReportBug } from './ReportBug';
import { StayAwake } from './StayAwake';
import { SwitchWrapper } from './SwitchWrapper';

export function MainSettings() {
  const { data: appVersion = '' } = useQuery(QueryKeys.AppVersion, getVersion);

  return (
    <div className="flex flex-col h-full gap-6 text-sm text-white">
      <Referral />
      <div className="w-full h-px bg-white" />
      <div className="flex justify-start gap-4">
        <SwitchWrapper title="Choose Network" switchComponent={Network} />

        <SwitchWrapper
          title="Automatic Updates"
          switchComponent={AutoUpdates}
        />
        <Tooltip
          tooltipContent="Keep my computer awake while running tasks"
          placement="top-left"
          theme={Theme.Light}
        >
          <SwitchWrapper title="Stay Awake" switchComponent={StayAwake} />
        </Tooltip>
      </div>

      <div className="w-full h-px bg-white" />

      <NodeLogs />

      <div className="flex justify-between w-full mt-2">
        <div className="mt-4">Version {appVersion}</div>
        <ReportBug />
      </div>
    </div>
  );
}
