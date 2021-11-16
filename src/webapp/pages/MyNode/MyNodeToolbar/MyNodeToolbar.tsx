import React from 'react';

import NodeLogo from 'src/assets/node-logo.svg';
import Toolbar from 'webapp/components/Toolbar';

import MyNodeActionCenter from './MyNodeActionCenter';

const MyNodeToolbar = (): JSX.Element => {
  return (
    <div>
      <Toolbar logo={NodeLogo} title="My Node" rightPart={<MyNodeActionCenter />} />
    </div>
  );
};

export default MyNodeToolbar;
