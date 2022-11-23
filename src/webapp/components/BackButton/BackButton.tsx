import * as React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { twMerge } from 'tailwind-merge';

import BackIconComponent from 'assets/svgs/back-icon.svg';
import { Button } from 'webapp/components/ui/Button';
import { getRouteViewLabel } from 'webapp/routing/utils';
import { AppRoute } from 'webapp/types/routes';

type RouterState = {
  noBackButton?: boolean;
};

type PropsType = {
  color?: 'white' | 'blue';
};

export const BackButton = ({ color }: PropsType) => {
  const location = useLocation();

  const navigate = useNavigate();
  const routeLabel = getRouteViewLabel(location.pathname as AppRoute);

  const noBackButton = (location?.state as RouterState)?.noBackButton;

  const handleBackButtonClick = () => {
    navigate(-1);
  };

  const labelClasses = twMerge(
    'text-white self-center uppercase h-[40px] text-[30px] align-middle pl-4 flex flex-col justify-center w-max',
    color === 'blue' && 'text-blue-1'
  );

  const wrapperClasses = twMerge(
    'flex items-center pt-[20px] pb-[20px] text-white',
    color === 'blue' && 'text-blue-1'
  );

  return (
    <div className={wrapperClasses}>
      {location.pathname === AppRoute.Root || noBackButton ? null : (
        <Button
          onlyIcon
          icon={
            <BackIconComponent className="cursor-pointer w-[36px] h-[36px]" />
          }
          onClick={handleBackButtonClick}
        />
      )}

      <div className={labelClasses}>{routeLabel}</div>
    </div>
  );
};
