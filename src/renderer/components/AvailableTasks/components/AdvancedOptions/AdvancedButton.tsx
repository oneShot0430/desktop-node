import { AddLine, Icon } from '@_koii/koii-styleguide';
import React from 'react';

export function AdvancedButton(props: any) {
  return (
    <button className="flex gap-4 items-center" {...props}>
      <Icon source={AddLine} size={20} color="#5ED9D1" />
      <div className="text-white text-sm">Advanced</div>
    </button>
  );
}
