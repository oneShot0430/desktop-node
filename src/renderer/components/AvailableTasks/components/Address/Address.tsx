import React from 'react';

import { EXPLORER_ADDRESS_URL } from 'config/explorer';
import { openBrowserWindow } from 'renderer/services';

type PropsType = {
  address: string;
  className?: string;
};

export function Address({ address, className }: PropsType) {
  const inspectAddressInExplorer = () =>
    openBrowserWindow(`${EXPLORER_ADDRESS_URL}${address}`);
  return (
    <span
      onClick={inspectAddressInExplorer}
      onKeyDown={inspectAddressInExplorer}
      className={`cursor-pointer hover:underline ${className}`}
      role="button"
      tabIndex={0}
    >
      {address}
    </span>
  );
}
