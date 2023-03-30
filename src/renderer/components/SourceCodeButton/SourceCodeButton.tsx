import { EmbedCodeFill, Icon } from '@_koii/koii-styleguide';
import React from 'react';

import { Tooltip } from 'renderer/components/ui';
import { openBrowserWindow } from 'renderer/services';
import { formatUrl, isValidUrl } from 'utils';

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
  const buttonClasses = `w-[54px] flex flex-col items-center ${
    repositoryUrl ? 'cursor-pointer' : 'cursor-not-allowed'
  }`;

  const fullUrl = formatUrl(repositoryUrl);
  const isValidRepositoryUrl = isValidUrl(fullUrl);
  const content = (
    <>
      <Icon
        source={EmbedCodeFill}
        size={iconSize}
        color={isValidRepositoryUrl ? '#BEF0ED' : 'lightgrey'}
      />
      {displayLabel && <span className="text-center">Source Code</span>}
    </>
  );

  const showSourceCodeInRepository = () => {
    openBrowserWindow(fullUrl);
  };

  return (
    <button
      className={buttonClasses}
      onClick={showSourceCodeInRepository}
      disabled={!isValidRepositoryUrl}
    >
      {isValidRepositoryUrl ? (
        content
      ) : (
        <Tooltip
          tooltipContent="Repository URL is missing or invalid"
          placement="top-left"
        >
          {content}
        </Tooltip>
      )}
    </button>
  );
}
