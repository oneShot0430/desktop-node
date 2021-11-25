import React, { useEffect, useRef } from 'react';

import CloseIcon from 'svgs/close-modal-icon.svg';
import { useAppDispatch, useAppSelector } from 'webapp/hooks/reduxHook';
import { closeModal } from 'webapp/store/actions/modal';

import ModalCreateTask from './ModalCreateTask';
import ModalWithdrawStake from './ModalWithdrawStake';

const Modal = (): JSX.Element => {
  const isOpen = useAppSelector((state) => state.modal.isShown);
  const modalType = useAppSelector((state) => state.modal.modalData.modalType);

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
    CREATE_TASK: <ModalCreateTask />,
    WITHDRAW_STAKE: <ModalWithdrawStake close={close} />,
  };

  return (
    <>
      {isOpen && (
        <div className="z-20 absolute top-0 left-0 w-screen h-screen flex items-center justify-center bg-black bg-opacity-40">
          <div
            ref={modalRef}
            className="w-156 h-79.5 relative rounded-md shadow-lg bg-finnieGray pt-6.25 text-center"
          >
            <CloseIcon
              data-testid="close-modal-button"
              onClick={close}
              className="w-6 h-6 absolute top-2 right-2 cursor-pointer"
            />
            {modalByTypes[modalType]}
          </div>
        </div>
      )}
    </>
  );
};

export default Modal;
