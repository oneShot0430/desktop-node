import React from 'react';

import FolderIcon from 'assets/svgs/folder-icon.svg';

import { LogsWeightLimitSwitch } from './LogsWeightLimitSwitch';
import { NodeLogsButton } from './NodeLogsButton';

export function NodeLogsSettingsSection() {
  return (
    <div className="flex justify-between">
      <div className="flex items-center gap-4">
        <NodeLogsButton />
        <FolderIcon />
      </div>

      <div className="flex items-center gap-6">
        <span className="font-semibold text-md">Limit Logs to 5 MB</span>
        <LogsWeightLimitSwitch />
      </div>
    </div>
  );
}
