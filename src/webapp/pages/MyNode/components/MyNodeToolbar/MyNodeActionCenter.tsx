import React from 'react';

import AddTasksLogo from 'svgs/add-icons/add-icon-orange.svg';
import FinnieLogoInverse from 'svgs/finnie-logos/finnie-logo-inverse.svg';
import HistoryAndLogsIcon from 'svgs/history-and-logs-icon.svg';
import PendingRewardsIcon from 'svgs/pending-rewards-icon.svg';
import TotalStakedIcon from 'svgs/total-staked-icon.svg';
import ActionButton from 'webapp/components/ActionButton';

import BalanceInfo from './BalanceInfo';

const MyNodeActionCenter = (): JSX.Element => {
  return (
    <div className="flex justify-between w-full">
      <div>
        <BalanceInfo
          logo={FinnieLogoInverse}
          name="Total KOII"
          value={3521.066}
        />
        <BalanceInfo
          logo={TotalStakedIcon}
          name="Total Staked"
          value={3521.066}
        />
        <BalanceInfo
          logo={PendingRewardsIcon}
          name="Pending Rewards"
          value={3521.066}
        />
      </div>
      <ActionButton
        logo={HistoryAndLogsIcon}
        name="History & Logs"
        variant="teal"
      />
      <ActionButton logo={AddTasksLogo} name="Add Tasks" variant="orange" />
    </div>
  );
};

export default MyNodeActionCenter;
