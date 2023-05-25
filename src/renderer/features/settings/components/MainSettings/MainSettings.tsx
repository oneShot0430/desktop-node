import React from 'react';
import { useQuery } from 'react-query';

import { QueryKeys, getVersion } from 'renderer/services';

import { Network } from './Network';
import { NodeLogs } from './NodeLogs';
import { Referral } from './Referral';
import { ReportBug } from './ReportBug';

export function MainSettings() {
  const { data: appVersion = '' } = useQuery(QueryKeys.AppVersion, getVersion);

  return (
    <div className="flex flex-col gap-7 text-white h-full text-sm">
      <Referral />
      <Network />
      <NodeLogs />

      <div className="mt-[120px] flex w-full justify-between">
        <div className="mt-4">Version {appVersion}</div>
        <ReportBug />
      </div>
    </div>
  );
}
