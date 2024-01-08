/* eslint-disable @cspell/spellchecker */
import { render, screen } from '@testing-library/react';
import React from 'react';

import { StakeInfoBox } from './StakeInfoBox';

describe('<StakeInfoBox />', () => {
  it('displays the total staked amount correctly', () => {
    render(<StakeInfoBox totalStaked={100000000000} />);
    expect(screen.getByText('100')).toBeInTheDocument();
    expect(screen.getByText('Total Staked')).toBeInTheDocument();
  });

  it('displays the pending rewards correctly', () => {
    render(<StakeInfoBox pendingStake={50000000000} />);
    expect(screen.getAllByText('50.00')[0]).toBeInTheDocument();
    expect(screen.getByText('Pending')).toBeInTheDocument();
  });

  it('displays the unstaked balance correctly', () => {
    render(<StakeInfoBox unstakedBalance={25000000000} />);
    expect(screen.getAllByText('25.00')[0]).toBeInTheDocument();
    expect(screen.getByText('Unstaked')).toBeInTheDocument();
  });

  it('renders with default props', () => {
    render(<StakeInfoBox />);
    expect(screen.getAllByText('0.00')).toHaveLength(3);
    expect(screen.getByText('Total Staked')).toBeInTheDocument();
    expect(screen.getByText('Pending')).toBeInTheDocument();
    expect(screen.getByText('Unstaked')).toBeInTheDocument();
  });

  it('renders the stake and freeze icons', () => {
    render(<StakeInfoBox />);
    expect(screen.getByTestId('koii-stake-icon')).toBeInTheDocument();
    expect(screen.getByTestId('koii-freez-icon')).toBeInTheDocument();
  });
});
