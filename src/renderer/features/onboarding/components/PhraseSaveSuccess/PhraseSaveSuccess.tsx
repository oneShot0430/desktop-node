import React from 'react';
import { useNavigate } from 'react-router-dom';

import CheckMarkIcon from 'assets/svgs/checkmark-icon.svg';
import WarningIndicatorSvg from 'assets/svgs/warning-indicator-icon.svg';
import { Button } from 'renderer/components/ui';
import { AppRoute } from 'renderer/types/routes';

export function PhraseSaveSuccess() {
  const navigate = useNavigate();
  return (
    <div className="flex flex-col items-center pt-[160px]">
      <div>
        <h1 className="flex items-center text-xl mb-9">
          <div className="text-finnieEmerald">
            <CheckMarkIcon />
          </div>
          You successfully saved your secret phrase
        </h1>
        <div className="mb-6">
          <p className="mb-6">Never share your secret phrase.</p>
          If you ever need this account on another device, use your <br />{' '}
          secret phrase to connect it. You shouldn’t enter your
          <br /> phrase for any other reason.
        </div>
        <div className="flex items-center text-sm text-finnieOrange">
          <WarningIndicatorSvg />
          This secret phrase grants access to all your tokens and rewards.
          <br /> No one from Koii will ever ask you for your secret phrase.
        </div>

        <div className="absolute left-0 right-0 z-50 bottom-16">
          <Button
            onClick={() => {
              navigate(AppRoute.OnboardingCreateFirstTask);
            }}
            label="Next"
            className="font-semibold bg-finnieGray-light text-finnieBlue-light w-[220px] h-[38px] mx-auto"
          />
        </div>
      </div>
    </div>
  );
}
