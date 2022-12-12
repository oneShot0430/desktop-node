import React, { FunctionComponent } from 'react';

import { getErrorToDisplay, ErrorContext } from 'webapp/utils';

interface PropsType {
  error: Error | string;
  context?: ErrorContext;
  className?: string;
}

export const ErrorMessage: FunctionComponent<PropsType> = ({
  error,
  context,
  className = '',
}) => {
  const errorMessage = getErrorToDisplay(error, context);
  const classNames = `py-3 text-sm text-finnieRed ${className}`;

  return <div className={classNames}>{errorMessage}</div>;
};
