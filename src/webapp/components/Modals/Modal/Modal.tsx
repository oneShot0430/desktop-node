import React, { useEffect, useRef } from 'react';

import { AddFunds } from 'webapp/components/AddFunds';
import { useAppDispatch, useAppSelector } from 'webapp/hooks/reduxHook';
import { closeModal } from 'webapp/store/actions/modal';

import AddKeyModal from '../AddKeyModal/AddKeyModal';
import { EditStakeAmountModal } from '../EditStakeAmountModal';
import ModalCreateTask from '../ModalCreateTask';
import ModalWithdrawStake from '../ModalWithdrawStake';

const Modal = (): JSX.Element => {
  const isOpen = useAppSelector((state) => state.modal.isShown);
  const modalType = useAppSelector((state) => state.modal.modalData.modalType);
  const modalData = useAppSelector((state) => state.modal.modalData.data);

  const modalRef = useRef<HTMLDivElement>(null);

  const dispatch = useAppDispatch();
  const close = () => dispatch(closeModal());

  useEffect(() => {
    const handleClickOutSide = (e: Event) => {
      if (modalRef.current && !modalRef.current.contains(e.target as Node)) {
        close();
      }
    };

    document.addEventListener('mousedown', handleClickOutSide);

    return () => document.removeEventListener('mousedown', handleClickOutSide);
  }, [modalRef]);

  const modalByTypes = {
    CREATE_TASK: <ModalCreateTask onClose={close} />,
    WITHDRAW_STAKE: <ModalWithdrawStake close={close} />,
    EDIT_STAKE_AMOUNT: <EditStakeAmountModal onClose={close} />,
    ADD_NEW_KEY: <AddKeyModal onClose={close} />,
    ADD_FUNDS_QR: <AddFunds onClose={close} pubKey={modalData} />,
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
