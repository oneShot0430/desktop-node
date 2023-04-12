import { Icon, ChevronArrowLine, CloseLine } from '@_koii/koii-styleguide';
import React, { memo } from 'react';
import { twMerge } from 'tailwind-merge';

type PropsType = Readonly<{
  title: React.ReactNode;
  onClose: () => void;
  onBackClick?: () => void;
  showBackButton?: boolean;
  theme?: 'dark' | 'light';
  titleClasses?: string;
  wrapperClasses?: string;
}>;

function ModalTopBar({
  title,
  onClose,
  onBackClick,
  showBackButton,
  theme = 'light',
  titleClasses = '',
  wrapperClasses = '',
}: PropsType) {
  const topBarMergedClasses = twMerge(
    'flex justify-between items-center h-[67px] px-4 shadow-[0_2px_8px_rgba(0,0,0,0.16)]',
    wrapperClasses
  );

  const titleMergedClasses = twMerge(
    'text-xl leading-[32px] text-finnieBlue font-semibold',
    theme === 'dark' && 'text-white',
    titleClasses
  );

  const iconMergedClasses = twMerge(
    'w-9 h-9 cursor-pointer',
    theme === 'dark' ? 'text-white' : 'text-finnieBlue'
  );

  return (
    <div className={topBarMergedClasses}>
      <div className="w-9 h-9">
        {showBackButton && onBackClick && (
          <Icon
            source={ChevronArrowLine}
            className={`${iconMergedClasses} -rotate-90`}
            onClick={onBackClick}
          />
        )}
      </div>
      <div className={titleMergedClasses}>{title}</div>
      <Icon
        source={CloseLine}
        className={iconMergedClasses}
        onClick={onClose}
      />
    </div>
  );
}

export default memo(ModalTopBar);
