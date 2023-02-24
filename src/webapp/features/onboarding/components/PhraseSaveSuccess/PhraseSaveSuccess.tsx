import {
  Icon,
  CheckSuccessLine,
  WarningTalkLine,
} from '@_koii/koii-styleguide';
import React from 'react';
import { useNavigate } from 'react-router-dom';

import { Button } from 'webapp/components/ui/Button';
import { AppRoute } from 'webapp/types/routes';

export function PhraseSaveSuccess() {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col items-center pt-[160px]">
      <div>
        <h1 className="flex items-center text-xl mb-9 gap-4">
          <div className="text-finnieEmerald">
            <Icon source={CheckSuccessLine} className="h-16 w-16" />
          </div>
          You successfully saved your secret phrase
        </h1>
        <div className="mb-6">
          <p className="mb-6">Never share your secret phrase.</p>
          If you ever need this account on another device, use your <br />{' '}
          secret phrase to connect it. You shouldn’t enter your
          <br /> phrase for any other reason.
        </div>
        <div className="flex items-center text-sm text-finnieOrange gap-4">
          <Icon source={WarningTalkLine} className="h-8 w-8" />
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
