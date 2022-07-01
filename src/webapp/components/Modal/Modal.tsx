import React, { useEffect, useRef } from 'react';

import { useAppDispatch, useAppSelector } from 'webapp/hooks/reduxHook';
import { closeModal } from 'webapp/store/actions/modal';

import { EditStakeAmountModal } from './EditStakeAmountModal';
import ModalCreateTask from './ModalCreateTask';
import ModalWithdrawStake from './ModalWithdrawStake';
import { TaskDetailsModal } from './TaskDetailsModal';

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
  };

  return (
    <>
      {isOpen && (
        <div className="absolute top-0 left-0 z-30 flex items-center justify-center w-screen h-screen bg-black bg-opacity-40">
          {modalType === 'TASK_DETAILS' ? (
            <div
              ref={modalRef}
              className="w-[90vw] h-[80vh] relative rounded-md shadow-lg bg-finnieBlue-light-secondary text-cente text-white o"
            >
              {modalByTypes[modalType]}
            </div>
          ) : (
            <div
              ref={modalRef}
              className="w-[600px] h-[380px] relative rounded-md shadow-lg bg-finnieGray text-center"
            >
              {modalByTypes[modalType]}
            </div>
          )}
        </div>
      )}
    </>
  );
};

export default Modal;
