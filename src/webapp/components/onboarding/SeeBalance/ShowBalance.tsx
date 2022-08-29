import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

import CheckMarkIcon from 'assets/svgs/checkmark-icon.svg';
import { AppRoute } from 'webapp/routing/AppRoutes';

type PropsType = {
  balance: string | number;
};

export const ShowBalance = ({ balance }: PropsType) => {
  const navigate = useNavigate();
  useEffect(() => {
    setTimeout(() => {
      navigate(AppRoute.MyNode);
    }, 5000);
  }, [navigate]);

  return (
    <div className="flex flex-col items-center">
      <div className="w-[492px] mb-4">
        Success! You can now stake tokens and run tasks to
        <br /> earn rewards.
      </div>
      <div className="w-[180px] h-[180px] p-2 border-dashed border-finnieEmerald-light rounded-full border-2 mb-4 cursor-pointer">
        <div className="flex flex-col items-center justify-center w-full h-full rounded-full text-finnieEmerald bg-finnieBlue-light-secondary">
          <CheckMarkIcon />
        </div>
      </div>
      <span className="text-white">{balance} KOII</span>
    </div>
  );
};
