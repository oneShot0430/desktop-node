import { useMemo } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

import { AppRoute } from 'renderer/types/routes';

const viewsWithBackButton = [
  AppRoute.OnboardingSeeBalance,
  AppRoute.OnboardingBackupKeyNow,
  AppRoute.OnboardingImportKey,
];

const sholdDisplayBackButton = (pathname: string) => {
  return viewsWithBackButton.includes(pathname as AppRoute);
};

export const useBackButtonHandler = () => {
  const { pathname } = useLocation();
  const navigate = useNavigate();

  const showOnboardingBackButton = useMemo(
    () => sholdDisplayBackButton(pathname),
    [pathname]
  );

  const handleBackButtonClick = () => {
    if (pathname === AppRoute.OnboardingBackupKeyNow) {
      navigate(AppRoute.OnboardingCreateNewKey);
      return;
    }

    navigate(-1);
  };

  return {
    handleBackButtonClick,
    showOnboardingBackButton,
    currentPath: pathname,
    navigate,
  };
};
