import { create, useModal } from '@ebay/nice-modal-react';
import React from 'react';
import { useNavigate } from 'react-router-dom';

import { Button } from 'webapp/components';
import { ModalContent, ModalTopbar } from 'webapp/components/Modals';
import { AppRoute } from 'webapp/routing/AppRoutes';

export const NotEnoughFunds = create(function NotEnoughFunds() {
  const modal = useModal();
  const navigate = useNavigate();

  return (
    <ModalContent>
      <ModalTopbar title={'Not Enough Funds'} onClose={() => modal.remove()} />

      <div className="p-8">
        <div className="flex items-center justify-center h-full mb-11">
          <p className="text-xl font-semibold text-finnieBlue">
            Do you want to fund your account to
            <br /> run these tasks?
          </p>
        </div>

        <div className="flex justify-center gap-4">
          <Button
            label="Skip Run Tasks"
            className="border bg-finnieRed text-finnieBlue border-finnieBlue"
            onClick={() => {
              modal.remove();
              navigate(AppRoute.MyNode);
            }}
          />
          <Button label="Fund my Key" />
        </div>
      </div>
    </ModalContent>
  );
});
