import React from 'react';
import { useNavigate } from 'react-router-dom';

import { Button } from 'webapp/components/ui/Button';
import { useFundNewAccountModal } from 'webapp/features/common';
import { AppRoute } from 'webapp/types/routes';

export const FundNewKey = () => {
  const navigate = useNavigate();
  const { showModal } = useFundNewAccountModal();

  const handleOpenQR = () => {
    showModal().then(() => {
      navigate(AppRoute.OnboardingSeeBalance);
    });
  };

  return (
    <div className="flex flex-col items-center justify-center w-full h-full">
      Add funds
      <div className="z-10 flex justify-between h-full gap-4">
        <Button label="QR" onClick={handleOpenQR} />
        <Button
          label="Next"
          onClick={() => navigate(AppRoute.OnboardingSeeBalance)}
        ></Button>
      </div>
    </div>
  );
};
