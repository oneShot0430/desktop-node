import * as React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

import BackIcon from 'svgs/back-icon.svg';
import { AppRoute } from 'webapp/routing/AppRoutes';
import { getRouteViewLabel } from 'webapp/routing/utils';
import { Button } from 'webapp/ui/Button';

export const BackButton = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const routeLabel = getRouteViewLabel(location.pathname as AppRoute);

  const handleBackButtonClick = () => {
    navigate(-1);
  };

  return (
    <div className="flex items-center pt-[20px] pb-[30px]">
      <Button
        onlyIcon
        icon={<BackIcon className="cursor-pointer" />}
        onClick={handleBackButtonClick}
      />

      <div className="text-white self-center uppercase h-[40px] leading-[40px] text-[30px] align-middle pl-4 flex flex-col justify-center">
        {routeLabel}
      </div>
    </div>
  );
};
