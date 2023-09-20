import React, { useState } from 'react';

import { Switch } from 'renderer/components/ui/Switch';

type PropsType = {
  sessionId: string;
  defaultValue?: boolean;
  onToggle: (isToggled: boolean) => void;
  disabled?: boolean;
};

export function ToggleScheduleSwitch({
  onToggle,
  defaultValue = false,
  sessionId,
  disabled,
}: PropsType) {
  const [isChecked, setIsChecked] = useState<boolean>(defaultValue);

  const handleSwitch = () => {
    setIsChecked((prevValue) => {
      const newValue = !prevValue;
      onToggle(newValue);
      return newValue;
    });
  };

  return (
    <Switch
      id={`${sessionId}onoff`}
      isChecked={isChecked}
      onSwitch={handleSwitch}
      disabled={disabled}
    />
  );
}
