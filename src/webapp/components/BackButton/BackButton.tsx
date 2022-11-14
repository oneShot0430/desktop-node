import * as React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

import BackIcon from 'svgs/back-icon-white.svg';
import { Button } from 'webapp/components/ui/Button';
import { getRouteViewLabel } from 'webapp/routing/utils';
import { AppRoute } from 'webapp/types/routes';

type RouterState = {
  fromOnboarding?: boolean;
};

export const BackButton = () => {
  const location = useLocation();

  const navigate = useNavigate();
  const routeLabel = getRouteViewLabel(location.pathname as AppRoute);

  const fromOnboarding = (location?.state as RouterState)?.fromOnboarding;

  const handleBackButtonClick = () => {
    navigate(-1);
  };

  return (
    <div className="flex items-center pt-[20px] pb-[20px]">
      {location.pathname === AppRoute.Root || fromOnboarding ? null : (
        <Button
          onlyIcon
          icon={<BackIcon className="cursor-pointer" />}
          onClick={handleBackButtonClick}
        />
      )}

      <div className="text-white self-center uppercase h-[40px] leading-[40px] text-[30px] align-middle pl-4 flex flex-col justify-center">
        {routeLabel}
      </div>
    </div>
  );
};
