import React from 'react';

import { MyNodeTable } from 'webapp/components/MyNodeTable/MyNodeTable';

import { Tooltip } from '../ui/Tooltip/Tooltip';

const MyNode = (): JSX.Element => {
  return (
    <div className="relative h-full overflow-y-auto">
      <Tooltip
        manualClose
        tooltipContent={
          'Hello from tooltip djdhd wjqwjweioqe qwqwejiojqweioeqw qwjiwqeioweqjwejwejkwewe'
        }
      >
        <span className="text-white">With tooltip</span>
      </Tooltip>
      <MyNodeTable />
    </div>
  );
};

export default MyNode;
