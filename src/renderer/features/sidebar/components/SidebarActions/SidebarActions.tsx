import {
  Icon,
  TipGiveLine,
  AddLine,
  WebCursorXlLine,
} from '@_koii/koii-styleguide';
import React from 'react';
import { twMerge } from 'tailwind-merge';

import { useFundNewAccountModal } from 'renderer/features/common';

type PropsType = {
  onPrimaryActionClick: () => void;
  onSecondaryActionClick: () => void;
  showMyNodeAction?: boolean;
};

const ICON_SIZE = 36;

export function SidebarActions({
  onPrimaryActionClick,
  onSecondaryActionClick,
  showMyNodeAction,
}: PropsType) {
  const { showModal: showFundModal } = useFundNewAccountModal();

  const actionBaselasses =
    'flex items-center rounded-md justify-center w-[85px] cursor-pointer';
  const primaryActionClasses = twMerge(
    actionBaselasses,
    'text-white',
    'bg-finnieBlue-light-secondary'
  );
  const secondaryActionClasses = twMerge(
    actionBaselasses,
    showMyNodeAction ? 'bg-finnieTeal-100' : 'bg-finnieTeal'
  );

  const handleKeyDown =
    (callback: () => void) => (event: React.KeyboardEvent) => {
      if (event.key === 'Enter') {
        callback();
      }
    };

  const handleAddFundsClick = () => {
    showFundModal();
    onPrimaryActionClick?.();
  };

  return (
    <div className="h-[60px] flex gap-2 justify-between">
      <div
        className={primaryActionClasses}
        onKeyDown={handleKeyDown(handleAddFundsClick)}
        onClick={handleAddFundsClick}
        tabIndex={0}
        role="button"
        data-testid="sidebar_tip_give_button"
      >
        <Icon
          source={TipGiveLine}
          size={ICON_SIZE}
          data-testid="tip-give-icon"
          aria-label="TipGiveLine icon"
        />
      </div>
      <div
        className={secondaryActionClasses}
        onClick={onSecondaryActionClick}
        onKeyDown={handleKeyDown(onSecondaryActionClick)}
        data-testid="sidebar_web_cursor_button"
        tabIndex={0}
        role="button"
      >
        <Icon
          source={showMyNodeAction ? WebCursorXlLine : AddLine}
          size={ICON_SIZE}
          data-testid="add-line-icon"
          aria-label="AddLine icon"
        />
      </div>
    </div>
  );
}
