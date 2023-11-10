import { Icon } from '@_koii/koii-styleguide';
import React, { useCallback, useMemo } from 'react';

import GearFill from 'assets/svgs/gear-fill.svg';
import GearLine from 'assets/svgs/gear-line.svg';
import { RequirementTag } from 'models';
import { Button, Placement, Tooltip } from 'renderer/components/ui';

type PropsType = {
  isTaskToolsValid: boolean;
  globalAndTaskVariables: RequirementTag[];
  onToggleView: (view: 'info' | 'settings') => void;
  hasInvertedTooltip?: boolean;
};

export function SettingsButton({
  globalAndTaskVariables,
  isTaskToolsValid,
  onToggleView,
  hasInvertedTooltip,
}: PropsType) {
  const handleToggleView = useCallback(
    () => onToggleView('settings'),
    [onToggleView]
  );
  const GearIcon = useMemo(
    () => (globalAndTaskVariables?.length ? GearFill : GearLine),
    [globalAndTaskVariables]
  );

  const gearIconColor = useMemo(
    () => (isTaskToolsValid ? 'text-finnieEmerald-light' : 'text-finnieOrange'),
    [isTaskToolsValid]
  );

  const gearTooltipContent = useMemo(
    () =>
      !globalAndTaskVariables?.length
        ? "This Task doesn't use any Task settings"
        : isTaskToolsValid
        ? 'Open task settings'
        : 'You need to set up the Task settings first in order to run this Task.',
    [globalAndTaskVariables, isTaskToolsValid]
  );
  const tooltipPlacement: Placement = `${
    hasInvertedTooltip ? 'bottom' : 'top'
  }-left`;

  return (
    <Tooltip placement={tooltipPlacement} tooltipContent={gearTooltipContent}>
      <div className="flex flex-col items-center justify-start w-10">
        <Button
          onMouseDown={handleToggleView}
          disabled={!globalAndTaskVariables?.length}
          icon={<Icon source={GearIcon} size={36} className={gearIconColor} />}
          onlyIcon
        />
      </div>
    </Tooltip>
  );
}
