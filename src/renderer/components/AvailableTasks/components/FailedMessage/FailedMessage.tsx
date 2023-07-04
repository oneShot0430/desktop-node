import { CloseLine } from '@_koii/koii-styleguide';
import React from 'react';
import toast from 'react-hot-toast';

import CloseIcon from 'assets/svgs/close-icon.svg';
import { getMainLogs } from 'renderer/services';

export function FailedMessage({ runTaskAgain }: any) {
  const retrieveTheLogs = async () => {
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

  return (
    <div className="h-[67px] w-full flex justify-start items-center text-white border-b-2 border-white relative">
      <div className="h-[67px] w-full absolute bg-[#FFA6A6] opacity-30" />
      <CloseIcon className="w-[45px] h-[45px] z-10 mr-5" />
      <div className="z-10">
        <p>
          Oops, something&apos;s not quite right.{' '}
          <span
            onClick={retrieveTheLogs}
            className="text-finnieTeal-100 underline cursor-pointer"
          >
            Retrieve the logs
          </span>{' '}
          or attempt to{' '}
          <span
            onClick={runTaskAgain}
            className="text-finnieTeal-100 underline cursor-pointer"
          >
            run it again.
          </span>
        </p>
      </div>
      <div />
    </div>
  );
}
