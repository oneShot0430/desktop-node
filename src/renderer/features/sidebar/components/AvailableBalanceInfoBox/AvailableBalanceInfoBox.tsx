import { Icon } from '@_koii/koii-styleguide';
import React from 'react';

import KoiiBrandIconCircled from 'assets/svgs/new/KoiiBrandIconCircled.svg';

import { CountKoii } from '../CountKoii';
import { InfoBox } from '../InfoBox';

type PropsType = {
  availableBalance?: number;
};

export function AvailableBalanceInfoBox({ availableBalance = 0 }: PropsType) {
  return (
    <InfoBox className="h-[60px] p-1 pr-2">
      <div className="flex items-center justify-between w-full">
        {/* TODO: replace with icon from styleguide, when available */}
        <Icon
          source={KoiiBrandIconCircled}
          size={48}
          aria-label="rewards icon"
          data-testid="koii-brand-icon"
        />

        <div className="flex flex-col items-end">
          <span className="text-lg">
            <CountKoii value={availableBalance} />
          </span>
          <span className="text-sm text-green-2">Available Balance</span>
        </div>
      </div>
    </InfoBox>
  );
}
