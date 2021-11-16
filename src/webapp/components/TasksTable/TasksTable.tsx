import React from 'react';

const TasksTable = (): JSX.Element => {
  return (
    <div className="w-full">
      <div className="flex pl-9.5 pr-8 bg-trueGray-100 font-semibold text-finnieBlue h-xxl items-center">
        <div className="w-19.5 text-center pr-8">Start/ Stop</div>
        <div className="w-92.75">Task Name & Start Time</div>
        <div className="w-38.5">Task Creator</div>
        <div className="w-35.5 text-center pr-12">Rewards Earned</div>
        <div className="w-36">My Stake</div>
        <div className="w-26.25">State</div>
        <div></div>
      </div>
      <div className="mt-56 w-1/2 text-center mx-auto text-3xl">
        MyNode - This is the table body
      </div>
    </div>
  );
};

export default TasksTable;
