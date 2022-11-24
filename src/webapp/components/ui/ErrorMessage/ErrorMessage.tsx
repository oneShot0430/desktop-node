import React, { FunctionComponent } from 'react';

import { getErrorToDisplay } from 'utils';

interface PropsType {
  error: Error | string;
}

export const ErrorMessage: FunctionComponent<PropsType> = ({ error }) => {
  const errorMessage = getErrorToDisplay(error);

  return <div className="py-3 text-sm text-finnieRed-500">{errorMessage}</div>;
};
