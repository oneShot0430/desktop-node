import React, { FunctionComponent } from 'react';

import { getErrorToDisplay, ErrorContext } from 'webapp/utils';

interface PropsType {
  error: Error | string;
  context?: ErrorContext;
}

export const ErrorMessage: FunctionComponent<PropsType> = ({
  error,
  context,
}) => {
  const errorMessage = getErrorToDisplay(error, context);

  return <div className="py-3 text-sm text-finnieRed-500">{errorMessage}</div>;
};
