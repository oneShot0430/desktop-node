import { Action } from 'redux';

import { Task } from 'webapp/@type/task';

export type ModalType = 'CREATE_TASK' | 'WITHDRAW_STAKE' | 'EDIT_STAKE_AMOUNT';

export type ModalPayload = {
  modalType: ModalType | null;
  task?: Task;
};

export interface IModalState {
  isShown: boolean;
  modalData: ModalPayload;
}

export interface ModalAction extends Action<string> {
  payload?: ModalPayload;
}
