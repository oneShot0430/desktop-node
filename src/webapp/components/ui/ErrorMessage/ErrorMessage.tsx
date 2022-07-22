import React, { memo } from 'react';

const ErrorMessage = ({ errorMessage }: { errorMessage: string }) => {
  return <div className="text-sm text-finnieRed-500">{errorMessage}</div>;
};

export default memo(ErrorMessage);
