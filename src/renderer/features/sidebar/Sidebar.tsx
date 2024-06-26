import React from 'react';

import { useMainAccountBalance } from '../settings';

import {
  RewardsClaimBox,
  StakeInfoBox,
  AvailableBalanceInfoBox,
  SidebarActions,
  RewardsInfoBox,
  MainWalletView,
} from './components';
import { useSidebraLogic } from './hooks';

export function Sidebar() {
  const {
    rewardsInfoBoxState,
    nodeInfoData,
    handleClickClaim,
    isClaimingRewards,
    isRewardClaimable,
    isAddTaskView,
    handleAddFundsClick,
    handleSecondaryActionClick,
  } = useSidebraLogic();

  const { accountBalance: mainAccountBalance } = useMainAccountBalance();

  return (
    <div className="flex flex-col pr-[22px] gap-4">
      <RewardsInfoBox rewardState={rewardsInfoBoxState} />
      <RewardsClaimBox
        rewardsAmount={nodeInfoData?.pendingRewards ?? 0}
        rewardClaimable={isRewardClaimable}
        onRewardClaimClick={handleClickClaim}
        isClaimingRewards={isClaimingRewards}
      />
      <StakeInfoBox totalStaked={nodeInfoData?.totalStaked ?? 0} />

      <AvailableBalanceInfoBox availableBalance={mainAccountBalance} />
      <SidebarActions
        showMyNodeAction={isAddTaskView}
        onPrimaryActionClick={handleAddFundsClick}
        onSecondaryActionClick={handleSecondaryActionClick}
      />

      <MainWalletView />

      {/* <div className="pb-5 mt-auto">
        <VersionDisplay />
      </div> */}
    </div>
  );
}
