import React from 'react';

import BackIcon from 'svgs/back-icon.svg';
import CloseIcon from 'svgs/close-icons/close-icon-blue.svg';

type PropsType = Readonly<{
  title: string;
  onClose: () => void;
  onBackClick?: () => void;
  showBackButton?: boolean;
}>;

export const ModalTopBar = ({
  title,
  onClose,
  onBackClick,
  showBackButton,
}: PropsType) => {
  return (
    <div className="flex justify-between items-center h-[67px] shadow-lg px-4">
      <div className="w-[36px] h-[36px]">
        {showBackButton && onBackClick && (
          <BackIcon
            data-testid="close-modal-button"
            onClick={onBackClick}
            className="w-[36px] h-[36px] cursor-pointer"
          />
        )}
      </div>
      <div className="text-xl leading-[32px] text-finnieBlue font-semibold">
        {title}
      </div>
      <div className="w-[36px] h-[36px]">
        <CloseIcon
          data-testid="close-modal-button"
          onClick={onClose}
          className="w-[36px] h-[36px] cursor-pointer"
        />
      </div>
    </div>
  );
};
