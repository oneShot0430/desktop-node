import React, { memo } from 'react';
import { twMerge } from 'tailwind-merge';

import BackIconBlue from 'svgs/back-icon.svg';
import CloseIconBlue from 'svgs/close-icons/close-icon-blue.svg';
import CloseIconWhite from 'svgs/close-icons/close-icon-white.svg';

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

const ModalTopBar = ({
  title,
  onClose,
  onBackClick,
  showBackButton,
  theme = 'light',
  titleClasses = '',
  wrapperClasses = '',
}: PropsType) => {
  const BackIconComponent = getBackIcon(theme);
  const CloseIconComponent = getCloseIcon(theme);

  const topBarMergedClasses = twMerge(
    'flex justify-between items-center h-[67px] px-4',
    'shadow-lg',
    wrapperClasses
  );

  const titleMergedClasses = twMerge(
    'text-xl leading-[32px] text-finnieBlue font-semibold',
    theme === 'dark' && 'text-white',
    titleClasses
  );

  return (
    <div className={topBarMergedClasses}>
      <div className="w-[36px] h-[36px]">
        {showBackButton && onBackClick && (
          <BackIconComponent
            data-testid="close-modal-button"
            onClick={onBackClick}
            className="w-[36px] h-[36px] cursor-pointer"
          />
        )}
      </div>
      <div className={titleMergedClasses}>{title}</div>
      <div className="w-[36px] h-[36px]">
        <CloseIconComponent
          data-testid="close-modal-button"
          onClick={onClose}
          className="w-[36px] h-[36px] cursor-pointer"
        />
      </div>
    </div>
  );
};

export default memo(ModalTopBar);
