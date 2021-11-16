import React from 'react';

import FinnieLogoInverse from 'src/assets/finnie-logo-inverse.svg';
import PendingRewardsLogo from 'src/assets/pending-rewards-logo.svg';
import TotalStakedLogo from 'src/assets/total-staked-logo.svg';

import BalanceInfo from './BalanceInfo';

const MyNodeActionCenter = (): JSX.Element => {
  return (
    <div>
      <BalanceInfo logo={FinnieLogoInverse} name="Total KOII" value={3521.066} />
      <BalanceInfo logo={TotalStakedLogo} name="Total Staked" value={3521.066} />
      <BalanceInfo logo={PendingRewardsLogo} name="Pending Rewards" value={3521.066} />
    </div>
  );
};

export default MyNodeActionCenter;
