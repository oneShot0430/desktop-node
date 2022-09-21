import React, { memo } from 'react';

const ErrorMessage = ({ errorMessage }: { errorMessage: string }) => {
  return <div className="py-3 text-sm text-finnieRed-500">{errorMessage}</div>;
};

export default memo(ErrorMessage);
