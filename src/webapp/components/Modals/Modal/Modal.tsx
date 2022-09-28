import React, { useEffect, useRef } from 'react';

import { AddFunds } from 'webapp/components/AddFunds';
import { NotEnoughFunds } from 'webapp/features/onboarding/components/ConfirmYourStake';
import { useAppDispatch, useAppSelector } from 'webapp/hooks/reduxHook';

import AddKeyModal from '../AddKeyModal/AddKeyModal';

const Modal = (): JSX.Element => {
  const isOpen = useAppSelector((state) => state.modal.isShown);
  const modalType = useAppSelector((state) => state.modal.modalData.modalType);
  const modalData = useAppSelector((state) => state.modal.modalData.data);

  const modalRef = useRef<HTMLDivElement>(null);

  const dispatch = useAppDispatch();

  useEffect(() => {
    const handleClickOutSide = (e: Event) => {
      if (modalRef.current && !modalRef.current.contains(e.target as Node)) {
        close();
      }
    };

    document.addEventListener('mousedown', handleClickOutSide);

    return () => document.removeEventListener('mousedown', handleClickOutSide);
  }, [close, modalRef]);

  const modalByTypes = {
    ADD_NEW_KEY: <AddKeyModal onClose={close} />,
    ADD_FUNDS_QR: <AddFunds onClose={close} pubKey={modalData} />,
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
