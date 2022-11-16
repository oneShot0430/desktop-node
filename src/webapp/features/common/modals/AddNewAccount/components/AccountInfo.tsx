import React, { useRef } from 'react';
import { twMerge } from 'tailwind-merge';

import CopyIconSvg from 'assets/svgs/copy-icon.svg';
import TooltipYellowIcon from 'assets/svgs/tooltip-teal-icon.svg';
import TooltipTealIcon from 'assets/svgs/tooltip-yellow-icon.svg';
import { Button } from 'webapp/components/ui/Button';

type KeyType = 'system' | 'task';
type PropsType = Readonly<{
  keyType: KeyType;
  address: string;
}>;

export const AccountInfo = ({ keyType, address }: PropsType) => {
  const addressRef = useRef<HTMLSpanElement>(null);

  const titleClasses = twMerge(
    'font-semibold text-finnieEmerald-light flex justify-start items-center',
    keyType === 'task' && 'text-finnieOrange'
  );

  const handleCopyToClipboard = () => {
    const address = addressRef.current.innerHTML;
    navigator.clipboard.writeText(address);
  };

  const isTaskKey = keyType === 'system';

  return (
    <div className="bg-finnieBlue-light-tertiary p-4 flex flex-col items-start rounded-md w-[100%]">
      <div className={titleClasses}>
        {`${isTaskKey ? 'System' : 'Task'} Key Address`}
        {isTaskKey ? <TooltipYellowIcon /> : <TooltipTealIcon />}
      </div>
      <div className="flex justify-start">
        {address && (
          <>
            <span ref={addressRef} className="pr-2">
              {address}
            </span>
            <Button
              icon={<CopyIconSvg />}
              className="rounded-[50%] w-[24px] h-[24px] bg-finnieTeal-100"
              onClick={handleCopyToClipboard}
            />
          </>
        )}
      </div>
    </div>
  );
};
