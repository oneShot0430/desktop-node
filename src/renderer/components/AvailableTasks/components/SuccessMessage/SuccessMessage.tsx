import React from 'react';
import { NavLink } from 'react-router-dom';

import CheckMarkTealIcon from 'assets/svgs/checkmark-teal-icon.svg';
import { AppRoute } from 'renderer/types/routes';

export function SuccessMessage() {
  return (
    <div className="h-[67px] w-full flex justify-start items-center text-white border-b-2 border-white relative">
      <div className="h-[67px] w-full absolute bg-[#9BE7C4] opacity-30" />
      <CheckMarkTealIcon className="w-[45px] h-[45px] z-10 mr-5" />
      <div className="z-10">
        <p>
          You’re succesfully running this task. Head over to{' '}
          <NavLink to={AppRoute.MyNode} className="text-[#5ED9D1] underline">
            My Node
          </NavLink>{' '}
          to monitor your rewards
        </p>
      </div>
      <div />
    </div>
  );
}
