import React from 'react';

import { LoadingSpinner, Switch } from 'renderer/components/ui';

interface Props {
  id: string;
  isLoading: boolean;
  isChecked: boolean;
  onSwitch: () => void;
  labels: [string, string];
}

export function SettingSwitch({
  id,
  isLoading,
  isChecked,
  onSwitch,
  labels,
}: Props) {
  const [leftLabel, rightLabel] = labels;

  return (
    <div className="flex items-center gap-4">
      <span>{leftLabel}</span>
      {isLoading ? (
        <LoadingSpinner className="mx-2.5" />
      ) : (
        <Switch id={id} isChecked={isChecked} onSwitch={onSwitch} />
      )}
      <span>{rightLabel}</span>
    </div>
  );
}
