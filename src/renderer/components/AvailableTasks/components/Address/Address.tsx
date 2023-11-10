import React, { ReactNode } from 'react';

import { EXPLORER_ADDRESS_URL } from 'config/explorer';
import { openBrowserWindow } from 'renderer/services';

type PropsType = {
  address: string;
  className?: string;
  overrideLabel?: ReactNode;
};

export function Address({ address, className, overrideLabel }: PropsType) {
  const inspectAddressInExplorer = () =>
    openBrowserWindow(`${EXPLORER_ADDRESS_URL}${address}`);
  const label = overrideLabel || address;

  return (
    <span
      onClick={inspectAddressInExplorer}
      onKeyDown={inspectAddressInExplorer}
      className={`cursor-pointer hover:underline ${className}`}
      role="button"
      tabIndex={0}
    >
      {label}
    </span>
  );
}
