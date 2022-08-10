import React from 'react';
import { useQuery } from 'react-query';

import CodeIconSvg from 'assets/svgs/code-icon.svg';
import { QueryKeys, fetchMyTasks } from 'webapp/services';

const RunFirstTask = () => {
  const {
    isLoading,
    data: tasks,
    error,
  } = useQuery([QueryKeys.taskList], fetchMyTasks);

  return (
    <div className="relative h-full overflow-hidden bg-finnieBlue-dark-secondary">
      <div className="px-6">
        <div className="flex flex-row bg-finnieBlue-light-secondary h-[52px] items-center rounded-sm">
          <div>
            <CodeIconSvg />
          </div>
          <div>name</div>
          <div>creator</div>
          <div>level</div>
          <div>stake</div>
        </div>
      </div>
    </div>
  );
};

export default RunFirstTask;
