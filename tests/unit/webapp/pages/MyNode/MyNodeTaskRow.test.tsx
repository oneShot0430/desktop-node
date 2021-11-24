import React from 'react';

import MainLayout from 'webapp/components/MainLayout';
import MyNodeTaskRow from 'webapp/pages/MyNode/components/MyNodeTasksTable/MyNodeTaskRow';

import { act, fireEvent, render, screen } from '../../test-utils';

const mockTaskData = {
  name: 'Mock Name',
  creator: 'Mock Create',
  rewardEarned: 123,
  myStake: 321,
  state: 'in progress',
  status: 'running',
};

describe('Task Row on My Node', () => {
  it('render Task Row with fully information without crashing', () => {
    render(<MyNodeTaskRow task={mockTaskData} isOdd={false} />);

    expect(screen.getByText(/Mock Name/i)).toBeInTheDocument();
    expect(screen.getByText(/Mock Create/i)).toBeInTheDocument();
    expect(screen.getByText(/123/i)).toBeInTheDocument();
    expect(screen.getByText(/321/i)).toBeInTheDocument();
    expect(screen.getByText(/in progress/i)).toBeInTheDocument();
  });

  describe('User clicks Withdraw Stake button on Task Row', () => {
    it('show Withdraw Stake modal with correct task information', async () => {
      render(
        <MainLayout>
          <MyNodeTaskRow task={mockTaskData} isOdd={false} />
        </MainLayout>
      );

      await act(async () => {
        await fireEvent.click(
          screen.getAllByRole('button', { name: /Withdraw Stake/i })[0]
        );
      });

      expect(screen.getAllByText(/Mock Name/i)).toHaveLength(2);
      expect(screen.getAllByText(/Mock Create/i)).toHaveLength(2);
      expect(
        screen.getByText(/You’ve earned 123 KOII tokens/i)
      ).toBeInTheDocument();
    });
  });
});
