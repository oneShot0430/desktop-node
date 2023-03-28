import { EmbedCodeFill, Icon } from '@_koii/koii-styleguide';
import React from 'react';

import { Tooltip } from 'renderer/components/ui';
import { openBrowserWindow } from 'renderer/services';

type PropsType = {
  repositoryUrl: string;
  displayLabel?: boolean;
  iconSize: number;
};

export function SourceCodeButton({
  repositoryUrl,
  displayLabel,
  iconSize,
}: PropsType) {
  const showSourceCodeInRepository = () => {
    const fullUrl = repositoryUrl.includes('http')
      ? repositoryUrl
      : `https://${repositoryUrl}`;

    openBrowserWindow(fullUrl);
  };

  const buttonClasses = `w-[54px] flex flex-col items-center ${
    repositoryUrl ? 'cursor-pointer' : 'cursor-not-allowed'
  }`;

  return (
    <button
      className={buttonClasses}
      onClick={showSourceCodeInRepository}
      disabled={!repositoryUrl}
    >
      {repositoryUrl ? (
        <>
          <Icon source={EmbedCodeFill} size={iconSize} color="#BEF0ED" />
          {displayLabel && <span className="text-center">Source Code</span>}
        </>
      ) : (
        <Tooltip
          tooltipContent="Repository URL is missing or invalid"
          placement="top-left"
        >
          <Icon source={EmbedCodeFill} size={iconSize} color="#BEF0ED" />
          {displayLabel && <span className="text-center">Source Code</span>}
        </Tooltip>
      )}
    </button>
  );
}
