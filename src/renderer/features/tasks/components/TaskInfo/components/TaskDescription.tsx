import React from 'react';

import { NOT_AVAILABLE_PLACEHOLDER } from '../constants';

type PropsType = {
  description?: string;
};

export function TaskDescription({ description }: PropsType) {
  return (
    <div className="text-start">
      <div className="mb-2 text-xl font-semibold">Description</div>
      <p className="mb-4 text-sm font-light select-text">
        {description ?? NOT_AVAILABLE_PLACEHOLDER}
      </p>
    </div>
  );
}
