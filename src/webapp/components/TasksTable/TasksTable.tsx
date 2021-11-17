import React from 'react';

const TasksTable = (): JSX.Element => {
  return (
    <div className="w-full">
      <div className="pl-9.5 pr-8 grid grid-cols-15 gap-x-3 bg-trueGray-100 font-semibold text-finnieBlue h-xxl items-center text-center">
        <div className="col-span-1">Start/ Stop</div>
        <div className="col-span-5 text-left">Task Name & Start Time</div>
        <div className="col-span-2">Task Creator</div>
        <div className="col-span-2 px-2">Rewards Earned</div>
        <div className="col-span-2">My Stake</div>
        <div className="col-span-1">State</div>
        <div className="col-span-2"></div>
      </div>
      <div className="mt-56 w-1/2 text-center mx-auto text-3xl">
        MyNode - This is the table body
      </div>
    </div>
  );
};

export default TasksTable;
