import React from 'react';

import AddTasksLogo from 'src/assets/add-icons/add-icon-orange.svg';
import FinnieLogoInverse from 'src/assets/finnie-logo-inverse.svg';
import HistoryAndLogsLogo from 'src/assets/history-and-logs-logo.svg';
import PendingRewardsLogo from 'src/assets/pending-rewards-logo.svg';
import TotalStakedLogo from 'src/assets/total-staked-logo.svg';
import ActionButton from 'webapp/components/ActionButton';

import BalanceInfo from './BalanceInfo';

const MyNodeActionCenter = (): JSX.Element => {
  return (
    <div className="flex justify-between w-full">
      <div>
        <BalanceInfo logo={FinnieLogoInverse} name="Total KOII" value={3521.066} />
        <BalanceInfo logo={TotalStakedLogo} name="Total Staked" value={3521.066} />
        <BalanceInfo logo={PendingRewardsLogo} name="Pending Rewards" value={3521.066} />
      </div>
      <ActionButton logo={HistoryAndLogsLogo} name="History & Logs" variant="teal" />
      <ActionButton logo={AddTasksLogo} name="Add Tasks" variant="orange" />
    </div>
  );
};

export default MyNodeActionCenter;
