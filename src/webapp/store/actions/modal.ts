import { ModalType, ModalAction } from '../types/modal';

import { HIDE_MODAL, SHOW_MODAL } from './types';

type ModalCallbackActions = Record<string, () => void>;

export const showModal = (modalType: ModalType, data?: any): ModalAction => ({
  type: SHOW_MODAL,
  payload: {
    modalType,
    data,
  },
});

export const closeModal = (): ModalAction => ({
  type: HIDE_MODAL,
});
