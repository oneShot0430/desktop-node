import { Icon } from '@_koii/koii-styleguide';
import React from 'react';

import SourceCode from 'assets/svgs/source-code.svg';
import { Tooltip } from 'renderer/components/ui';
import { openBrowserWindow } from 'renderer/services';
import { formatUrl, isValidUrl } from 'utils';

type PropsType = {
  repositoryUrl: string;
};

export function SourceCodeButton({ repositoryUrl }: PropsType) {
  const buttonClasses = `w-[54px] flex flex-col items-center ${
    repositoryUrl ? 'cursor-pointer' : 'cursor-not-allowed'
  }`;

  const fullUrl = formatUrl(repositoryUrl);
  const isValidRepositoryUrl = isValidUrl(fullUrl);
  const content = (
    <>
      <Icon source={SourceCode} size={44} />
      <span className="text-center">Source Code</span>
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
