import { Button, ButtonSize, ButtonVariant } from '@_koii/koii-styleguide';
import React from 'react';

export function NodeLogs() {
  const handleClick = () => {
    console.log('open');
    window.main.openNodeLogfileFolder();
  };

  return (
    <div className="flex flex-col gap-5">
      <span className="font-semibold">Open Node Logs</span>
      <Button
        onClick={handleClick}
        variant={ButtonVariant.Secondary}
        size={ButtonSize.SM}
        label="Get Logs"
      />
    </div>
  );
}
