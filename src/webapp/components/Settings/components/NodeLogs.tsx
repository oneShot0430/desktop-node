import React, { memo } from 'react';

import { SourceCode } from 'webapp/components/SourceCode';

type PropsType = Readonly<{
  logs: string;
}>;

const NodeLogs = ({ logs }: PropsType) => {
  return (
    <div className="ml-10 overflow-auto h-[420px]">
      <SourceCode sourceCode={logs} />
    </div>
  );
};

export default memo(NodeLogs);
