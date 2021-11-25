import React from 'react';
import * as ReactRouterDom from 'react-router-dom';

import MainLayout from 'webapp/components/MainLayout';
import MyNode from 'webapp/pages/MyNode';

import { act, fireEvent, render, screen } from '../../test-utils';

const mockedNavigate = jest.fn();

jest.mock('react-router-dom', () => ({
  ...(jest.requireActual('react-router-dom') as typeof ReactRouterDom),
  useNavigate: () => mockedNavigate,
}));

describe('My Node', () => {
  it('render My Node without crashing', () => {
    render(<MyNode />);
  });

  describe('User clicks Add Tasks button', () => {
    it('shows the Add Tasks screen', async () => {
      render(
        <MainLayout>
          <MyNode />
        </MainLayout>
      );

      await act(async () => {
        await fireEvent.click(
          screen.getByRole('button', { name: /Add Tasks/i })
        );
      });

      expect(mockedNavigate).toHaveBeenCalledWith('/add-tasks');
    });
  });

  describe('User clicks Withdraw Stake button', () => {
    it('shows the Withdraw Stake modal', async () => {
      render(
        <MainLayout>
          <MyNode />
        </MainLayout>
      );

      await act(async () => {
        await fireEvent.click(
          screen.getAllByRole('button', { name: /Withdraw Stake/i })[0]
        );
      });

      expect(screen.getByText(/Stay Staked/i)).toBeInTheDocument();
    });
  });

  describe('User clicks Stay Staked button', () => {
    it('close the Withdraw Stake modal', async () => {
      render(
        <MainLayout>
          <MyNode />
        </MainLayout>
      );

      await act(async () => {
        await fireEvent.click(
          screen.getAllByRole('button', { name: /Withdraw Stake/i })[0]
        );
      });

      expect(screen.getByText(/Stay Staked/i)).toBeInTheDocument();

      await act(async () => {
        await fireEvent.click(
          screen.getByRole('button', { name: /Stay Staked/i })
        );
      });

      expect(screen.queryByText(/Stay Staked/i)).not.toBeInTheDocument();
    });
  });
});
