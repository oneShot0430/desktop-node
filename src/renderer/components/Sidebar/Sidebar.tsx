import React from 'react';

import { Actions } from './components/Actions';
import { Summary } from './components/Summary';

export function Sidebar() {
  return (
    <div className="flex flex-col pr-[22px] gap-4">
      <Summary />
      <Actions />
    </div>
  );
}
