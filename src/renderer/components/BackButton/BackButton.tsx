import { ChevronArrowLine, Icon } from '@_koii/koii-styleguide';
import * as React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { twMerge } from 'tailwind-merge';

import { Button } from 'renderer/components/ui/Button';
import { getRouteViewLabel } from 'renderer/routing/utils';
import { AppRoute } from 'renderer/types/routes';

type RouterState = {
  noBackButton?: boolean;
};

type PropsType = {
  color?: 'white' | 'blue';
};

export function BackButton({ color }: PropsType) {
  const location = useLocation();

  const navigate = useNavigate();
  const routeLabel = getRouteViewLabel(location.pathname as AppRoute);

  const noBackButton = (location?.state as RouterState)?.noBackButton;

  const handleBackButtonClick = () => {
    navigate(-1);
  };

  const labelClasses = twMerge(
    'text-white self-center uppercase h-10 text-3xl pr-2 align-middle pl-4 flex flex-col justify-center w-max',
    color === 'blue' && 'text-blue-1'
  );

  const wrapperClasses = twMerge(
    'flex items-center py-5 text-white',
    color === 'blue' && 'text-blue-1'
  );

  return (
    <div className={wrapperClasses}>
      {location.pathname === AppRoute.Root || noBackButton ? null : (
        <Button
          onlyIcon
          icon={
            <Icon
              source={ChevronArrowLine}
              className="-rotate-90 cursor-pointer w-9 h-9"
            />
          }
          onClick={handleBackButtonClick}
        />
      )}

      <div className={labelClasses}>{routeLabel}</div>
    </div>
  );
}
