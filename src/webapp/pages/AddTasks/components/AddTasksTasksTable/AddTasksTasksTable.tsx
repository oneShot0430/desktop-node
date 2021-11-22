import React from 'react';

import AddTasksTaskRow from './AddTasksTaskRow';

const tasks = [
  {
    name: 'Task 1',
    creator: 'Creator 1',
    bounty: 1000,
    nodes: 125,
    topStake: 100.0,
    stake: 526.94,
    minStake: 275,
    status: 'running',
  },
  {
    name: 'Task 2',
    creator: 'Creator 1',
    bounty: 1011,
    nodes: 1251,
    topStake: 100.01,
    stake: 526.94,
    minStake: 205,
    status: 'running',
  },
  {
    name: 'Task 3',
    creator: 'Creator 1',
    bounty: 1502,
    nodes: 125,
    topStake: 100.02,
    stake: 526.94,
    minStake: 275,
    status: 'running',
  },
  {
    name: 'Task 4',
    creator: 'Creator 1',
    bounty: 1035,
    nodes: 25,
    topStake: 100.03,
    stake: 0,
    minStake: 275,
    status: 'initialize',
  },
  {
    name: 'Task 5',
    creator: 'Creator 1',
    bounty: 1204,
    nodes: 1125,
    topStake: 100.04,
    stake: 526.94,
    minStake: 275,
    status: 'running',
  },
  {
    name: 'Task 6',
    creator: 'Creator 1',
    bounty: 10005,
    nodes: 1235,
    topStake: 100.99,
    stake: 526.94,
    minStake: 275,
    status: 'running',
  },
];

const AddTasksTasksTable = (): JSX.Element => {
  return (
    <div className="w-full">
      <div className="w-full fixed z-10 pl-6 pr-6 grid grid-cols-16 gap-x-3 bg-trueGray-100 font-semibold text-finnieBlue h-xxl pt-3 text-center">
        <div className="col-span-1"></div>
        <div className="col-span-5 text-left">Task Name & Start Time</div>
        <div className="col-span-2">Task Creator</div>
        <div className="col-span-5 grid grid-cols-3">
          <div className="col-span-1 px-2">
            <div className="tracking-finnieSpacing-wider">Bounty</div>
            <div className="text-finnieTeal-700 text-2xs tracking-finnieSpacing-wider">
              (KOII)
            </div>
          </div>
          <div className="col-span-1">
            <div className="tracking-finnieSpacing-wider">Nodes</div>
            <div className="text-finnieTeal-700 text-2xs tracking-finnieSpacing-wider">
              participating
            </div>
          </div>
          <div className="col-span-1">
            <div className="tracking-finnieSpacing-wider">Top Stake</div>
            <div className="text-finnieTeal-700 text-2xs tracking-finnieSpacing-wider">
              (KOII)
            </div>
          </div>
        </div>
        <div className="col-span-3 grid grid-cols-5">
          <div className="col-span-3">
            <div className="tracking-finnieSpacing-wider">Set Stake</div>
            <div className="text-finnieTeal-700 text-2xs tracking-finnieSpacing-wider">
              (KOII)
            </div>
          </div>
          <div className="col-span-2">Run Task</div>
        </div>
      </div>
      <div className="pt-xxl">
        {tasks.map((task, index) => (
          <AddTasksTaskRow key={index} task={task} isOdd={index % 2 === 0} />
        ))}
      </div>
    </div>
  );
};

export default AddTasksTasksTable;
