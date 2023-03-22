import React, { useState } from 'react';

import { Toggle } from 'renderer/components/ui';

export function NodeSettings() {
  const [checked, setChecked] = useState(false);

  const toggleNetwork = () => {
    setChecked((checked) => !checked);
    // window.main.switchNetwork();
  };

  return (
    <div className="flex flex-col gap-10 text-white">
      <span className="text-2xl font-semibold text-left">
        Choose Node Network
      </span>
      <div className="flex items-center gap-4">
        <span>TESTNET</span>
        <Toggle checked={checked} onChange={toggleNetwork} />
        <span>DEVNET</span>
      </div>
    </div>
  );
}
