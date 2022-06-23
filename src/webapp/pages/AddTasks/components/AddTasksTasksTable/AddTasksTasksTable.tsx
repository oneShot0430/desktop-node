import React from 'react';

import tasks from 'webapp/tasks';

import AddTasksTaskRow from './AddTasksTaskRow';

const AddTasksTasksTable = (): JSX.Element => {
  return (
    <div className="w-full">
      <div className="w-full fixed z-10 pl-6 pr-6 grid grid-cols-16 gap-x-3 bg-neutral-100 font-semibold text-finnieBlue h-xxl pt-3 text-center">
        <div className="col-span-1"></div>
        <div className="col-span-5 text-left">Task Name & Start Time</div>
        <div className="col-span-2">Task Creator</div>
        <div className="col-span-5 grid grid-cols-3">
          <div className="col-span-1 px-2">
            <div className="tracking-finnieSpacing-wider">Bounty</div>
            <div className="font-normal text-finnieTeal-700 text-2xs tracking-finnieSpacing-wider">
              (KOII)
            </div>
          </div>
          <div className="col-span-1">
            <div className="tracking-finnieSpacing-wider">Nodes</div>
            <div className="font-normal text-finnieTeal-700 text-2xs tracking-finnieSpacing-wider">
              participating
            </div>
          </div>
          <div className="col-span-1">
            <div className="tracking-finnieSpacing-wider">Top Stake</div>
            <div className="font-normal text-finnieTeal-700 text-2xs tracking-finnieSpacing-wider">
              (KOII)
            </div>
          </div>
        </div>
        <div className="col-span-3 grid grid-cols-5">
          <div className="col-span-3">
            <div className="tracking-finnieSpacing-wider">Set Stake</div>
            <div className="font-normal text-finnieTeal-700 text-2xs tracking-finnieSpacing-wider">
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
