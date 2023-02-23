import React, { memo } from 'react';
import { twMerge } from 'tailwind-merge';

import { ReactComponent as BackIconBlue } from 'assets/svgs/back-icon.svg';
import { ReactComponent as CloseIconBlue } from 'assets/svgs/close-icons/close-icon-blue.svg';
import { ReactComponent as CloseIconWhite } from 'assets/svgs/close-icons/close-icon-white.svg';

type PropsType = Readonly<{
  title: React.ReactNode;
  onClose: () => void;
  onBackClick?: () => void;
  showBackButton?: boolean;
  theme?: 'dark' | 'light';
  titleClasses?: string;
  wrapperClasses?: string;
}>;

const getCloseIcon = (theme: 'dark' | 'light') => {
  return {
    dark: CloseIconWhite,
    light: CloseIconBlue,
  }[theme];
};

const getBackIcon = (theme: 'dark' | 'light') => {
  return {
    dark: BackIconBlue,
    light: BackIconBlue,
  }[theme];
};

function ModalTopBar({
  title,
  onClose,
  onBackClick,
  showBackButton,
  theme = 'light',
  titleClasses = '',
  wrapperClasses = '',
}: PropsType) {
  const BackIconComponent = getBackIcon(theme);
  const CloseIconComponent = getCloseIcon(theme);

  const topBarMergedClasses = twMerge(
    'flex justify-between items-center h-[67px] px-4',
    wrapperClasses
  );

  const titleMergedClasses = twMerge(
    'text-xl leading-[32px] text-finnieBlue font-semibold',
    theme === 'dark' && 'text-white',
    titleClasses
  );

  return (
    <div className={topBarMergedClasses}>
      <div className="w-9 h-9">
        {showBackButton && onBackClick && (
          <BackIconComponent
            data-testid="close-modal-button"
            onClick={onBackClick}
            className="cursor-pointer w-9 h-9"
          />
        )}
      </div>
      <div className={titleMergedClasses}>{title}</div>
      <div className="w-9 h-9">
        <CloseIconComponent
          data-testid="close-modal-button"
          onClick={onClose}
          className="cursor-pointer w-9 h-9"
        />
      </div>
    </div>
  );
}

export default memo(ModalTopBar);
