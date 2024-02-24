import React from 'react';
import { useQuery } from 'react-query';

import { QueryKeys, getVersion } from 'renderer/services';

export function VersionDisplay() {
  const { data: appVersion } = useQuery(QueryKeys.AppVersion, getVersion, {
    refetchInterval: Infinity,
  });

  return (
    <div className="p-2 mt-2 text-sm text-white">
      Version {appVersion?.appVersion ?? ''}
    </div>
  );
}
