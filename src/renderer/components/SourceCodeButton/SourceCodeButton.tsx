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
  const fullUrl = formatUrl(repositoryUrl);
  const isValidRepositoryUrl = isValidUrl(fullUrl);
  const buttonClasses = `w-[54px] flex flex-col items-center ${
    repositoryUrl ? 'cursor-pointer' : 'cursor-not-allowed'
  }`;
  const tooltipContent = isValidRepositoryUrl
    ? 'Source Code'
    : 'Repository URL is missing or invalid';

  const showSourceCodeInRepository = () => {
    openBrowserWindow(fullUrl);
  };

  return (
    <button
      className={buttonClasses}
      onClick={showSourceCodeInRepository}
      disabled={!isValidRepositoryUrl}
    >
      <Tooltip tooltipContent={tooltipContent} placement="top-left">
        <Icon source={SourceCode} size={30} className="stroke-[1.3px]" />
      </Tooltip>
    </button>
  );
}
