import { render, screen } from '@testing-library/react';
import React from 'react';

import { RewardsClaimBox } from './RewardsClaimBox';

describe('RewardsClaimBox', () => {
  it('should render without crashing', () => {
    render(<RewardsClaimBox onRewardClaimClick={jest.fn()} />);
    expect(screen.getByLabelText('rewards icon')).toBeInTheDocument();
  });

  it('should display the correct rewards amount', () => {
    const REWARDS_AMOUNT_IN_ROE = 10000000000;
    render(
      <RewardsClaimBox
        rewardsAmount={REWARDS_AMOUNT_IN_ROE}
        onRewardClaimClick={jest.fn()}
      />
    );
    expect(screen.getByText('10')).toBeInTheDocument();
  });

  it('should display the claim rewards button when reward is claimable', () => {
    render(<RewardsClaimBox rewardClaimable onRewardClaimClick={jest.fn()} />);
    const claimRewardsButton = screen.getByTestId('claim-rewards-button');
    expect(claimRewardsButton).toBeInTheDocument();
    expect(claimRewardsButton).toHaveTextContent('Claim Rewards');
  });

  it('should display the loading text when reward is not claimable', () => {
    render(
      <RewardsClaimBox rewardClaimable={false} onRewardClaimClick={jest.fn()} />
    );
    expect(screen.getByText('KOII coming your way...')).toBeInTheDocument();
  });
});
