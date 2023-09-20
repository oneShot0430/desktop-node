import { CloseLine } from '@_koii/koii-styleguide';
import React from 'react';
import toast from 'react-hot-toast';

import { getMainLogs } from 'renderer/services';

export const openMainLogs = async () => {
  try {
    await getMainLogs();
  } catch (err) {
    toast.error('Failed to retrieve the logs', {
      duration: 4500,
      icon: <CloseLine className="h-5 w-5" />,
      style: {
        backgroundColor: '#FFA6A6',
        paddingRight: 0,
      },
    });
  }
};
