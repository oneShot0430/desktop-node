import React from 'react';

import { Tooltip } from 'renderer/components/ui';
import { Theme } from 'renderer/types/common';

import { AutoUpdates } from './AutoUpdates';
import { LaunchOnRestart } from './LaunchOnRestart';
import { Network } from './Network';
import { NodeLogs } from './NodeLogs';
import { Referral } from './Referral';
import { ReportBug } from './ReportBug';
import { StayAwake } from './StayAwake';
import { SwitchWrapper } from './SwitchWrapper';

export function MainSettings() {
  return (
    <div className="flex flex-col h-full gap-6 text-sm text-white">
      <Referral />
      <div className="w-full h-px bg-white" />
      <div className="flex justify-start gap-4">
        <SwitchWrapper
          title="Choose Network"
          switchComponent={Network}
          className="w-[238px]"
        />

        <SwitchWrapper
          title="Automatic Updates"
          switchComponent={AutoUpdates}
          className="w-[220px]"
        />

        <Tooltip
          tooltipContent="Keep my computer awake while running tasks"
          placement="top-left"
          theme={Theme.Light}
        >
          <SwitchWrapper
            title="Stay Awake"
            switchComponent={StayAwake}
            className="w-[194px]"
          />
        </Tooltip>

        <Tooltip
          tooltipContent="Automatically launch your node when the computer boots up."
          placement="top-left"
          theme={Theme.Light}
        >
          <SwitchWrapper
            title="Launch on Restart"
            switchComponent={LaunchOnRestart}
            className="w-[210px]"
          />
        </Tooltip>
      </div>

      <div className="w-full h-px bg-white" />

      <NodeLogs />

      <div className="flex justify-end w-full mt-2">
        <ReportBug />
      </div>
    </div>
  );
}
