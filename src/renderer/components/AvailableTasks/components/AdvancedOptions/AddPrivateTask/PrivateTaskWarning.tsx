import { Icon, WarningTriangleFill } from '@_koii/koii-styleguide';
import React from 'react';

type PropsType = {
  taskWarning: string;
};

export function PrivateTaskWarning({ taskWarning }: PropsType) {
  return (
    <div className="flex gap-2 items-center text-xs pl-4 pt-2 text-[#FFA54B]">
      <Icon source={WarningTriangleFill} size={16} className="ml-[1px]" />
      {taskWarning}
    </div>
  );
}
