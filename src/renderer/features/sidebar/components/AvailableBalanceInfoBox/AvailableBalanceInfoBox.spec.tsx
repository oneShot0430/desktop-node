import { render, screen } from '@testing-library/react';
import React from 'react';

import { AvailableBalanceInfoBox } from './AvailableBalanceInfoBox';
import '@testing-library/jest-dom';

describe.skip('AvailableBalanceInfoBox component', () => {
  it.skip('renders the koii brand icon', () => {
    render(<AvailableBalanceInfoBox availableBalance={10} />);
    const iconElement = screen.getByTestId('koii-brand-icon');
    expect(iconElement).toBeInTheDocument();
  });

  it.skip('renders the available balance', () => {
    const VALUE_IN_ROE = 10000000000;
    render(<AvailableBalanceInfoBox availableBalance={VALUE_IN_ROE} />);
    const balanceElement = screen.getAllByText('10.00');
    expect(balanceElement[0]).toBeInTheDocument();
  });

  it.skip('defaults to 0 when no available balance is provided', () => {
    render(<AvailableBalanceInfoBox />);
    const balanceElement = screen.getByText('0.00');
    expect(balanceElement).toBeInTheDocument();
  });
});
