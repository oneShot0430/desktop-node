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

  return (
    <div className={`py-3 text-sm text-finnieRed-500 ${className}`}>
      {errorMessage}
    </div>
  );
};
