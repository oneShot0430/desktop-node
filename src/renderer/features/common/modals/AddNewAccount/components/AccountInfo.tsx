import {
  TooltipChatQuestionLeftLine,
  CopyLine,
  Icon,
  CheckSuccessLine,
} from '@_koii/koii-styleguide';
import React, { useRef } from 'react';
import { twMerge } from 'tailwind-merge';

import { Tooltip, Button } from 'renderer/components/ui';
import { useClipboard } from 'renderer/features/common/hooks';

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

  const { copyToClipboard, copied: hasCopiedKey } = useClipboard();

  const handleCopyPublicKey = () => copyToClipboard(address);

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
            <div className="flex justify-center gap-4">
              <Tooltip tooltipContent={hasCopiedKey ? 'Copied' : 'Copy'}>
                <Button
                  onClick={handleCopyPublicKey}
                  icon={
                    <Icon
                      source={hasCopiedKey ? CheckSuccessLine : CopyLine}
                      className="text-black h-4 w-4"
                    />
                  }
                  className="rounded-full w-6.5 h-6.5 bg-finnieTeal-100"
                />
              </Tooltip>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
