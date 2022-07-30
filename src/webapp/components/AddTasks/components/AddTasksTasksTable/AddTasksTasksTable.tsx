import React from 'react';
import { useQuery } from 'react-query';

import { fetchMyTasks, QueryKeys } from 'webapp/services';

import AddTasksTaskRow from './AddTasksTaskRow';

const AddTasksTasksTable = (): JSX.Element => {
  const { data: tasks } = useQuery([QueryKeys.myTaskList], fetchMyTasks);

  return (
    <div className="w-full">
      <div className="fixed z-10 grid w-full pt-3 pl-6 pr-6 font-semibold text-center grid-cols-16 gap-x-3 bg-neutral-100 text-finnieBlue h-xxl">
        <div className="col-span-1"></div>
        <div className="col-span-5 text-left">Task Name & Start Time</div>
        <div className="col-span-2">Task Creator</div>
        <div className="grid grid-cols-3 col-span-5">
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
        <div className="grid grid-cols-5 col-span-3">
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
