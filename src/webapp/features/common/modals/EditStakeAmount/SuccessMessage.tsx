import React, { memo } from 'react';

import SuccessSvg from 'assets/svgs/success-lg.svg';
import { Button } from 'webapp/components/ui/Button';

type PropsType = Readonly<{
  onOkClick: () => void;
  successMessage: string;
  stakedAmount?: number;
}>;

export function SuccessMessage({
  onOkClick,
  stakedAmount,
  successMessage,
}: PropsType) {
  return (
    <div className="relative flex flex-col items-center justify-center text-finnieBlue-dark">
      <div className="absolute z-0 left-[38px] top-[38px]">
        <SuccessSvg />
      </div>
      <div className="mb-3 mt-[38px] max-w-[360px]">{successMessage}</div>
      <div className="text-4xl text-center text-finnieBlue-dark">
        {stakedAmount && `${stakedAmount} KOII`}
      </div>
      <div className="mt-[38px]">
        <Button label="Ok" onClick={onOkClick} className="text-white" />
      </div>
    </div>
  );
}

export default memo(SuccessMessage);
