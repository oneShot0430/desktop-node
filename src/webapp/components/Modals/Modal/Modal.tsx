import React, { useEffect, useRef } from 'react';

import { useAppDispatch, useAppSelector } from 'webapp/hooks/reduxHook';
import { closeModal } from 'webapp/store/actions/modal';

import AddKeyModal from '../AddKeyModal/AddKeyModal';
import { EditStakeAmountModal } from '../EditStakeAmountModal';
import ModalCreateTask from '../ModalCreateTask';
import ModalWithdrawStake from '../ModalWithdrawStake';
import { TaskDetailsModal } from '../TaskDetailsModal';

const Modal = (): JSX.Element => {
  const isOpen = useAppSelector((state) => state.modal.isShown);
  const modalType = useAppSelector((state) => state.modal.modalData.modalType);
  const task = useAppSelector((state) => state.modal.modalData.task);

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
    EDIT_STAKE_AMOUNT: <EditStakeAmountModal onClose={close} />,
    TASK_DETAILS: <TaskDetailsModal onClose={close} task={task} />,
    ADD_NEW_KEY: <AddKeyModal onClose={close} />,
  };

  // light w-[600px] h-[380px] bg-finnieGray text-center
  // w-[90vw] h-[80vh] relative rounded-md shadow-lg bg-finnieBlue-light-secondary  text-white

  return (
    <>
      {isOpen && (
        <div className="absolute top-0 left-0 z-30 flex items-center justify-center w-screen h-screen bg-black bg-opacity-40">
          <div ref={modalRef} className="relative rounded-md shadow-lg">
            {modalByTypes[modalType]}
          </div>
        </div>
      )}
    </>
  );
};

export default Modal;
