import React from 'react';

import MyNodeTaskRow from './MyNodeTaskRow';

const tasks = [
  {
    name: 'Task 1',
    creator: 'Creator 1',
    rewardEarned: 123.123,
    myStake: 101,
    state: 'in progress',
    status: 'running',
  },
  {
    name: 'Task 2',
    creator: 'Creator 2',
    rewardEarned: 124.124,
    myStake: 102,
    state: 'accepted',
    status: 'running',
  },
  {
    name: 'Task 3',
    creator: 'Creator 3',
    rewardEarned: 123.123,
    myStake: 103,
    state: 'waiting to verify',
    status: 'running',
  },
  {
    name: 'Task 4',
    creator: 'Creator 1',
    rewardEarned: 125.123,
    myStake: 101,
    state: 'waiting to verify',
    status: 'running',
  },
  {
    name: 'Task 5',
    creator: 'Creator 1',
    rewardEarned: 121.124,
    myStake: 100,
    state: 'accepted',
    status: 'running',
  },
  {
    name: 'Task 6',
    creator: 'Creator 3',
    rewardEarned: 120.123,
    myStake: 103,
    state: 'in progress',
    status: 'paused',
  },
];

const MyNodeTasksTable = (): JSX.Element => {
  return (
    <div className="w-full">
      <div className="w-full fixed z-10 pl-9.5 pr-8 grid grid-cols-15 gap-x-3 bg-trueGray-100 font-semibold text-finnieBlue h-xxl items-center text-center">
        <div className="col-span-1">Start/ Stop</div>
        <div className="col-span-5 text-left pl-2">Task Name & Start Time</div>
        <div className="col-span-2">Task Creator</div>
        <div className="col-span-2 px-2">Rewards Earned</div>
        <div className="col-span-2">My Stake</div>
        <div className="col-span-3 grid grid-cols-2 items-center">
          <div className="col-span-1">State</div>
          <div className="col-span-1"></div>
        </div>
      </div>
      <div className="pt-xxl">
        {tasks.map((task, index) => (
          <MyNodeTaskRow key={index} task={task} isOdd={index % 2 === 0} />
        ))}
      </div>
    </div>
  );
};

export default MyNodeTasksTable;
