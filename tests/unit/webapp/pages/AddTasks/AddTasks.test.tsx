import React from 'react';

import { MainLayout, AddTasks } from 'webapp/components';

import { act, render, fireEvent, screen } from '../../test-utils';

describe('Add Tasks', () => {
  it('render Add Tasks without crashing', () => {
    render(<AddTasks />);
  });

  describe('User clicks New Task button', () => {
    it('shows the New Task modal', async () => {
      render(
        <MainLayout>
          <AddTasks />
        </MainLayout>
      );

      await act(async () => {
        await fireEvent.click(
          screen.getByRole('button', { name: /new task/i })
        );
      });

      expect(
        screen.getByText(/Create your own Koii Tasks/i)
      ).toBeInTheDocument();
    });
  });

  describe('User clicks Close button on New Task modal', () => {
    it('close the New Task modal', async () => {
      render(
        <MainLayout>
          <AddTasks />
        </MainLayout>
      );

      await act(async () => {
        await fireEvent.click(
          screen.getByRole('button', { name: /new task/i })
        );
      });

      expect(
        screen.getByText(/Create your own Koii Tasks/i)
      ).toBeInTheDocument();

      await act(async () => {
        await fireEvent.click(screen.getByTestId('close-modal-button'));
      });

      expect(
        screen.queryByText(/Create your own Koii Tasks/i)
      ).not.toBeInTheDocument();
    });
  });
});
