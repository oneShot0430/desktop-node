import * as React from 'react';

import { Actions } from './components/Actions';
import { Summary } from './components/Summary';

export const Sidebar = () => {
  return (
    <div className="flex flex-col pr-[22px] gap-[26px]">
      <Summary totalEarned={123} totalStaked={123} pendingRewards={123} />
      <Actions />
    </div>
  );
};
