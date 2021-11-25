import { ModalType, ModalAction } from '../types/modal';

import { HIDE_MODAL, SHOW_MODAL } from './types';

export const showModal = (
  modalType: ModalType,
  taskInfo?: { name: string; creator: string; rewardEarned: number }
): ModalAction =>
  modalType === 'CREATE_TASK'
    ? {
        type: SHOW_MODAL,
        payload: {
          modalType,
        },
      }
    : {
        type: SHOW_MODAL,
        payload: {
          modalType,
          taskInfo,
        },
      };

export const closeModal = (): ModalAction => ({
  type: HIDE_MODAL,
});
