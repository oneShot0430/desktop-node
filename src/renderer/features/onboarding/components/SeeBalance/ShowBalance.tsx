import { Icon, CheckSuccessLine } from '@_koii/koii-styleguide';
import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

import { AppRoute } from 'renderer/types/routes';
import { getKoiiFromRoe } from 'utils';

type PropsType = {
  balance: number;
};

export function ShowBalance({ balance }: PropsType) {
  const navigate = useNavigate();
  useEffect(() => {
    setTimeout(() => {
      navigate(AppRoute.OnboardingCreateFirstTask);
    }, 5000);
  }, [navigate]);

  return (
    <div className="flex flex-col items-center h-full pt-48 text-center">
      <div className="w-[492px] mb-10">
        Success! You can now stake tokens and run tasks to
        <br /> earn rewards.
      </div>
      <div className="w-[180px] h-[180px] p-2 border-dashed border-finnieEmerald-light rounded-full border-2 mb-4 cursor-pointer">
        <div className="flex flex-col items-center justify-center w-full h-full gap-3 rounded-full text-finnieEmerald bg-finnieBlue-light-secondary">
          <Icon source={CheckSuccessLine} className="w-16 h-16" />
          <p className="text-lg leading-6">{getKoiiFromRoe(balance)} KOII</p>
        </div>
      </div>
    </div>
  );
}
