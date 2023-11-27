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
    <InfoBox className="justify-center h-20 p-2 pr-2 xl:p-4">
      <div className="flex items-center justify-between w-full">
        <div className="flex flex-col items-start">
          <span className="text-sm text-green-2">Available Balance</span>
          <span className="text-lg">
            <CountKoii value={availableBalance} />
          </span>
        </div>
        {/* TODO: replace with icon from styleguide, when available */}
        <Icon
          source={KoiiBrandIconCircled}
          size={56}
          aria-label="rewards icon"
          data-testid="koii-brand-icon"
        />
      </div>
    </InfoBox>
  );
}
