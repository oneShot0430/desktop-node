import React from 'react';
import { useQuery } from 'react-query';

import { QueryKeys, getVersion } from 'renderer/services';

import { Network } from './Network';
import { Referral } from './Referral';

export function MainSettings() {
  const { data: appVersion = '' } = useQuery(QueryKeys.AppVersion, getVersion);

  return (
    <div className="flex flex-col gap-7 text-white h-full text-sm">
      <Referral />
      <Network />

      <div className="mt-[136px]">Version {appVersion}</div>
    </div>
  );
}
