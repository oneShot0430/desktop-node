import React from 'react';

import MyNodeIcon from 'svgs/toolbar-icons/my-node-icon.svg';
import Toolbar from 'webapp/components/Toolbar';

import MyNodeActionCenter from './MyNodeActionCenter';

const MyNodeToolbar = (): JSX.Element => {
  return (
    <div>
      <Toolbar
        logo={MyNodeIcon}
        title="My Node"
        rightPart={<MyNodeActionCenter />}
      />
    </div>
  );
};

export default MyNodeToolbar;
