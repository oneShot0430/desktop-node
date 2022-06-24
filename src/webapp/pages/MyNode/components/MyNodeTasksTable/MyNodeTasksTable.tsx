import React, { useEffect, useState } from 'react';

import { Task } from 'webapp/@type/task';

import MyNodeTaskRow from './MyNodeTaskRow';

const MyNodeTasksTable = (): JSX.Element => {
  const [tasks, setTasks] = useState<Task[]>([]);

  const fetchTasks = () => {
    window.main
      .getTasks()
      .then((apiTasks) =>
        apiTasks.map(({ data, publicKey }) => ({ publicKey, ...data }))
      )
      .then((t) => {
        console.log(t);
        return t;
      })
      .then((tasks) => {
        setTasks(tasks);
      });
  };

  useEffect(() => fetchTasks(), []);

  return (
    <div className="w-full">
      <div className="fixed z-10 pl-9.5 pr-8 grid grid-cols-15 gap-x-3 bg-neutral-100 font-semibold text-finnieBlue h-xxl items-center text-center">
        <div className="col-span-1">Start/ Stop</div>
        <div className="col-span-5 pl-2 text-left">Task Name & Start Time</div>
        <div className="col-span-2">Task Creator</div>
        <div className="col-span-2 px-2">Rewards Earned</div>
        <div className="col-span-2">My Stake</div>
        <div className="grid items-center grid-cols-2 col-span-3">
          <div className="col-span-1">State</div>
          <div className="col-span-1"></div>
        </div>
      </div>
      <div className="pt-xxl">
        {tasks.map((task, index) => (
          <MyNodeTaskRow
            key={index}
            task={task}
            isOdd={index % 2 === 0}
            onChange={fetchTasks}
          />
        ))}
      </div>
    </div>
  );
};

export default MyNodeTasksTable;
