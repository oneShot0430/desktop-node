import * as React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

import BackIcon from 'svgs/back-icon.svg';
import { AppRoute } from 'webapp/routing/AppRoutes';
import { getRouteVieLabel } from 'webapp/routing/utils';
import { Button } from 'webapp/ui/Button';

export const BackButton = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const routeLabel = getRouteVieLabel(location.pathname as AppRoute);

  const handleBackButtonClick = () => {
    navigate(-1);
  };

  return (
    <div className="flex items-center">
      <Button
        icon={<BackIcon className="cursor-pointer " />}
        onClick={handleBackButtonClick}
      />

      <div className="text-white self-center uppercase leading-[30px] text-[30px] pl-4">
        {routeLabel}
      </div>
    </div>
  );
};
