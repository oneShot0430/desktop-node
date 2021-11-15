import React from 'react';

import NodeLogo from 'src/assets/node-logo.svg';
import Toolbar from 'webapp/components/Toolbar';

const MyNode = (): JSX.Element => {
  return (
    <div>
      <Toolbar logo={NodeLogo} title="My Node" rightPart={<div>Right part</div>} />
      <div>This is the Node page</div>
    </div>
  );
};

export default MyNode;
