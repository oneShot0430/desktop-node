import React, { useRef } from 'react';

import { NotEnoughFunds } from 'webapp/features/onboarding/components/ConfirmYourStake';
import { useAppSelector } from 'webapp/hooks/reduxHook';

const Modal = (): JSX.Element => {
  const isOpen = useAppSelector((state) => state.modal.isShown);
  const modalType = useAppSelector((state) => state.modal.modalData.modalType);

  const modalRef = useRef<HTMLDivElement>(null);

  const modalByTypes = {
    NOT_ENOUGH_FUNDS: <NotEnoughFunds onClose={close} />,
  };

  return (
    <>
      {isOpen && (
        <div className="absolute top-0 left-0 z-50 flex items-center justify-center w-screen h-screen bg-black bg-opacity-40">
          <div ref={modalRef} className="relative rounded-md shadow-lg">
            {modalByTypes[modalType]}
          </div>
        </div>
      )}
    </>
  );
};

export default Modal;
