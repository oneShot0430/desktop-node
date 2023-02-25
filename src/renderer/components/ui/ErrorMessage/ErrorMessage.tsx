import React from 'react';

import { getErrorToDisplay, ErrorContext } from 'renderer/utils';

interface PropsType {
  error: Error | string;
  context?: ErrorContext;
  className?: string;
}

export function ErrorMessage({ error, context, className = '' }: PropsType) {
  const errorMessage = getErrorToDisplay(error, context);
  const classNames = `py-3 text-sm text-finnieRed ${className}`;

  return <div className={classNames}>{errorMessage}</div>;
}
