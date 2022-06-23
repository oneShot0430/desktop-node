// import React from 'react';
//
// import MainLayout from 'webapp/components/MainLayout';
// import MyNodeTaskRow from 'webapp/pages/MyNode/components/MyNodeTasksTable/MyNodeTaskRow';
//
// import { act, fireEvent, render, screen } from '../../test-utils';
//
// const mockTaskData = {
//   name: 'Paint a Banana Purple',
//   owner: 'StoreCat',
//   txId: '0xw21311',
//   bounty: 1000,
//   nodes: 125,
//   topStake: 100.0,
//   stake: 526.94,
//   minStake: 275,
//   status: 'running',
//   rewardEarned: 123.123,
//   myStake: 101,
//   state: 'accepted',
// } as const;
//
// describe('Task Row on My Node', () => {
//   it('render Task Row with fully information without crashing', () => {
//     render(<MyNodeTaskRow task={mockTaskData} isOdd={false} />);
//
//     expect(screen.getByText(/Paint a Banana Purple/i)).toBeInTheDocument();
//     expect(screen.getByText(/StoreCat/i)).toBeInTheDocument();
//     expect(screen.getByText(/123.123/i)).toBeInTheDocument();
//     expect(screen.getByText(/101/i)).toBeInTheDocument();
//     expect(screen.getByText(/accepted/i)).toBeInTheDocument();
//   });
//
//   describe('User clicks Withdraw Stake button on Task Row', () => {
//     it('show Withdraw Stake modal with correct task information', async () => {
//       render(
//         <MainLayout>
//           <MyNodeTaskRow task={mockTaskData} isOdd={false} />
//         </MainLayout>
//       );
//
//       await act(async () => {
//         await fireEvent.click(
//           screen.getAllByRole('button', { name: /Withdraw Stake/i })[0]
//         );
//       });
//
//       expect(screen.getAllByText(/Paint a Banana Purple/i)).toHaveLength(2);
//       expect(screen.getAllByText(/StoreCat/i)).toHaveLength(2);
//       expect(
//         screen.getByText(/You’ve earned 123.123 KOII tokens/i)
//       ).toBeInTheDocument();
//     });
//   });
// });
