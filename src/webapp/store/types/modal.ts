import { Action } from 'redux';

import { Task } from 'webapp/types';

export type ModalType =
  | 'CREATE_TASK'
  | 'WITHDRAW_STAKE'
  | 'EDIT_STAKE_AMOUNT'
  | 'TASK_DETAILS'
  | 'ADD_NEW_KEY';

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
