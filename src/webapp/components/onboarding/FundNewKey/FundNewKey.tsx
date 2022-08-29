import React from 'react';
import { useQuery } from 'react-query';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';

import { Button } from 'webapp/components/ui/Button';
import { AppRoute } from 'webapp/routing/AppRoutes';
import { getMainAccountPublicKey } from 'webapp/services';
import { showModal } from 'webapp/store/actions/modal';

export const FundNewKey = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { data: mainAccountPubKey } = useQuery(
    ['main-account'],
    getMainAccountPublicKey
  );

  console.log('###DATA', mainAccountPubKey);

  const handleOpenQR = () => {
    dispatch(showModal('ADD_FUNDS_QR', mainAccountPubKey));
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
