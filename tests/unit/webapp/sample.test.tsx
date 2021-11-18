import '@testing-library/jest-dom';

import { render, screen } from '@testing-library/react';
import React from 'react';

import BalanceInfo from 'webapp/pages/MyNode/components/MyNodeToolbar/BalanceInfo';

test('Balace info', () => {
  render(
    <BalanceInfo logo={() => <div>Helle</div>} name="HelloW" value={1.12} />
  );

  expect(screen.getByText(/hellow/i)).toBeInTheDocument();
});
