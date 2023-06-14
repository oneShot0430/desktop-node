import React, { useState } from 'react';

import { ColumnsLayout } from 'renderer/components/ui';

import { AddPrivateTask } from './AddPrivateTask';
import { AdvancedButton } from './AdvancedButton';

interface Props {
  columnsLayout: ColumnsLayout;
}

export function AdvancedOptions({ columnsLayout }: Props) {
  const [isAddPrivateTaskVisible, setIsAddPrivateTaskVisible] = useState(false);

  const handleAdvancedButtonClick = () => {
    setIsAddPrivateTaskVisible((prevState) => !prevState);
  };

  const handleAddPrivateTaskClose = () => {
    setIsAddPrivateTaskVisible(false);
  };

  const animationClasses = isAddPrivateTaskVisible
    ? 'opacity-100 scale-100'
    : 'opacity-0 scale-95';

  return (
    <div className="relative z-50">
      <div
        className={`transition-all duration-500 ease-in-out transform ${animationClasses}`}
      >
        {isAddPrivateTaskVisible && (
          <div className="absolute -bottom-9 left-0 w-full z-50">
            <AddPrivateTask
              columnsLayout={columnsLayout}
              onClose={handleAddPrivateTaskClose}
            />
          </div>
        )}
      </div>
      {!isAddPrivateTaskVisible && (
        <div className="pl-8 py-4">
          <AdvancedButton onClick={handleAdvancedButtonClick} />
        </div>
      )}
    </div>
  );
}
