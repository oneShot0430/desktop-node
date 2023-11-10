import { CheckSuccessLine, CopyLine, Icon } from '@_koii/koii-styleguide';
import React from 'react';

import { Button } from '../Button';
import { Tooltip } from '../Tooltip';

interface CopyButtonProps {
  onCopy: () => void;
  isCopied: boolean;
  className?: string;
}

export function CopyButton({
  onCopy,
  isCopied,
  className = '',
}: CopyButtonProps) {
  const tooltipContent = isCopied ? 'Copied' : 'Copy';
  const iconSource = isCopied ? CheckSuccessLine : CopyLine;
  const buttonClasses = `rounded-full w-4 h-4 bg-transparent outline-none ${className}`;

  return (
    <Tooltip tooltipContent={tooltipContent}>
      <Button
        onClick={onCopy}
        icon={<Icon source={iconSource} className="h-4 w-4 text-white" />}
        className={buttonClasses}
      />
    </Tooltip>
  );
}
