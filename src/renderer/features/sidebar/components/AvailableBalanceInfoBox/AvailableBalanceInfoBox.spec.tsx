import { render, screen } from '@testing-library/react';
import React from 'react';

import { AvailableBalanceInfoBox } from './AvailableBalanceInfoBox';
import '@testing-library/jest-dom';

describe('AvailableBalanceInfoBox component', () => {
  it('renders the koii brand icon', () => {
    render(<AvailableBalanceInfoBox availableBalance={10} />);
    const iconElement = screen.getByTestId('koii-brand-icon');
    expect(iconElement).toBeInTheDocument();
  });

  it('renders the available balance', () => {
    const VALUE_IN_ROE = 10000000000;
    render(<AvailableBalanceInfoBox availableBalance={VALUE_IN_ROE} />);
    const balanceElement = screen.getByText('10');
    expect(balanceElement).toBeInTheDocument();
  });

  it('defaults to 0 when no available balance is provided', () => {
    render(<AvailableBalanceInfoBox />);
    const balanceElement = screen.getByText('0');
    expect(balanceElement).toBeInTheDocument();
  });
});
