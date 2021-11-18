import { render, screen, fireEvent, act } from '@testing-library/react';
import React from 'react';

import App from 'webapp/App';

describe('Web App', () => {
  it('renders without crashing', () => {
    render(<App />);
  });

  it('shows navbar', () => {
    render(<App />);

    expect(screen.getByRole('navigation')).toBeInTheDocument();
  });

  describe('User clicks to rewards tabs', () => {
    it('shows the rewards tabs', async () => {
      render(<App />);

      await act(async () => {
        await fireEvent.click(screen.getByText('Rewards'));
      });

      expect(screen.getAllByText('Rewards')).toHaveLength(2);
    });
  });
});
