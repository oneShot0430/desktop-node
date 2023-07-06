import React, { MutableRefObject, useRef } from 'react';
import { useNavigate } from 'react-router-dom';

import CloseSvg from 'assets/svgs/colored-close.svg';
import DesktopSvg from 'assets/svgs/destop.svg';
import { useOnClickOutside } from 'renderer/features/common/hooks';
import { AppRoute } from 'renderer/types/routes';

import { useNotificationsContext } from '../context';

export function FirstTaskRunningNotification({ id }: { id: string }) {
  const { removeNotificationById } = useNotificationsContext();
  const navigate = useNavigate();

  const close = () => removeNotificationById(id);
  const onCTAClick = () => {
    navigate(AppRoute.AddTask);
    close();
  };
  const ref = useRef<HTMLDivElement>(null);

  useOnClickOutside(ref as MutableRefObject<HTMLDivElement>, close);

  return (
    <div
      className="absolute right-[53px] bottom-[43px] text-white z-[100] bg-blue-1 p-3 rounded-lg"
      ref={ref}
    >
      <div className="flex">
        <DesktopSvg />
        <div className="ml-[30px] max-w-[430px]">
          <p className="text-[32px] leading-[40px]">
            Congrats! You’re running your first tasks!
          </p>
          <p className="mt-1 text-base leading-8">
            Head over to{' '}
            <button
              className="text-finnieEmerald-light underline cursor-pointer"
              onClick={onCTAClick}
            >
              Add Tasks
            </button>{' '}
            to start making some more!{' '}
          </p>
        </div>
        <div>
          <button className="w-auto h-auto" onClick={() => close()}>
            <CloseSvg />
          </button>
        </div>
      </div>
    </div>
  );
}
