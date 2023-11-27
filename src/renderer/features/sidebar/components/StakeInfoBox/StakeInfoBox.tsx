/* eslint-disable @cspell/spellchecker */
import { Icon } from '@_koii/koii-styleguide';
import React from 'react';

import FreezIcon from 'assets/svgs/new/FreezIcon.svg';
import StakeIcon from 'assets/svgs/new/StakeIcon.svg';

import { CountKoii } from '../CountKoii';
import { InfoBox } from '../InfoBox';

type PropsType = {
  totalStaked?: number;
  pendingStake?: number;
  unstakedBalance?: number;
};

export function StakeInfoBox({
  totalStaked = 0,
  pendingStake = 0,
  unstakedBalance = 0,
}: PropsType) {
  return (
    <InfoBox className="flex flex-col justify-center h-20 gap-2 max-h-28 xl:p-4">
      <div className="flex items-center justify-between w-full">
        <div className="flex flex-col items-start">
          <span className="text-sm text-green-2">Total Staked</span>
          <span className="text-lg">
            <CountKoii value={totalStaked} />
          </span>
        </div>
        {/* TODO: replace with icon from styleguide, when available */}
        <Icon
          source={StakeIcon}
          size={48}
          aria-label="rewards icon"
          data-testid="koii-stake-icon"
        />
      </div>
      {/* TODO (Wojciech): remove "hidden" and add "flex" when the second row is implemented */}
      <div className="justify-between hidden ">
        <div className="flex items-center justify-between w-[78px] h-10 bg-green-2 bg-opacity-20 p-1 rounded-md">
          {/* TODO: replace with icon from styleguide, when available */}
          <Icon
            className="text-green-2"
            source={FreezIcon}
            size={24}
            aria-label="rewards icon"
            data-testid="koii-freez-icon"
          />

          <div className="flex flex-col items-end">
            <span className="text-xs">
              <CountKoii value={pendingStake} />
            </span>
            <span className="text-[10px] text-green-2">Pending</span>
          </div>
        </div>

        <div className="flex items-center justify-end w-[78px] h-10 bg-purple-6 bg-opacity-20 p-1 rounded-md">
          <div className="flex flex-col items-end">
            <span className="text-xs text-gray-light">
              <CountKoii value={unstakedBalance} />
            </span>
            <span className="text-[10px] text-green-2">Unstaked</span>
          </div>
        </div>
      </div>

      <div />
    </InfoBox>
  );
}
