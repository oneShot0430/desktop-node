import { Task } from 'webapp/types';

import { ModalType, ModalAction } from '../types/modal';

import { HIDE_MODAL, SHOW_MODAL } from './types';

export const showModal = (modalType: ModalType, task?: Task): ModalAction => ({
  type: SHOW_MODAL,
  payload: {
    modalType,
    task,
  },
});

export const closeModal = (): ModalAction => ({
  type: HIDE_MODAL,
});
