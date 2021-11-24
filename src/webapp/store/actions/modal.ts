import { ModalType, ModalAction } from '../types/modal';

import { HIDE_MODAL, SHOW_MODAL } from './types';

export const showModal = (modalType: ModalType): ModalAction => ({
  type: SHOW_MODAL,
  payload: modalType,
});

export const closeModal = (): ModalAction => ({
  type: HIDE_MODAL,
});
