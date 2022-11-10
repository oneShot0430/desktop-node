import * as React from 'react';

import { getKoiiFromRoe } from 'utils';

import { Actions } from './components/Actions';
import { Summary } from './components/Summary';

// TO DO: get the actual values
const totalEarned = 123000000000;
const totalStaked = 123000000000;
const pendingRewards = 123000000000;

export const Sidebar = () => {
  const totalEarnedInKoii = getKoiiFromRoe(totalEarned);
  const totalStakedInKoii = getKoiiFromRoe(totalStaked);
  const pendingRewardsInKoii = getKoiiFromRoe(pendingRewards);

  return (
    <div className="flex flex-col pr-[22px] gap-[26px]">
      <Summary
        totalEarned={totalEarnedInKoii}
        totalStaked={totalStakedInKoii}
        pendingRewards={pendingRewardsInKoii}
      />
      <Actions />
    </div>
  );
};
