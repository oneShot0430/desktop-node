import {
  TooltipChatQuestionLeftLine,
  CopyLine,
  Icon,
} from '@_koii/koii-styleguide';
import React, { useRef } from 'react';
import { twMerge } from 'tailwind-merge';

import { Button } from 'renderer/components/ui/Button';

type KeyType = 'system' | 'task';
type PropsType = Readonly<{
  keyType: KeyType;
  address: string;
}>;

export function AccountInfo({ keyType, address }: PropsType) {
  const addressRef = useRef<HTMLSpanElement>(null);

  const titleClasses = twMerge(
    'font-semibold text-finnieEmerald-light flex justify-start items-center gap-1',
    keyType === 'task' && 'text-finnieOrange'
  );

  const handleCopyToClipboard = () => {
    const address = addressRef.current?.innerHTML;
    navigator.clipboard.writeText(address || '');
  };

  const isTaskKey = keyType === 'system';

  return (
    <div className="bg-finnieBlue-light-tertiary p-4 flex flex-col items-start rounded-md w-[100%]">
      <div className={titleClasses}>
        {`${isTaskKey ? 'System' : 'Task'} Key Address`}

        <Icon source={TooltipChatQuestionLeftLine} className="h-4 w-4" />
      </div>
      <div className="flex justify-start">
        {address && (
          <>
            <span ref={addressRef} className="pr-2">
              {address}
            </span>
            <Button
              icon={<Icon source={CopyLine} className="text-black h-4 w-4" />}
              className="rounded-[50%] w-[24px] h-[24px] bg-finnieTeal-100"
              onClick={handleCopyToClipboard}
            />
          </>
        )}
      </div>
    </div>
  );
}
