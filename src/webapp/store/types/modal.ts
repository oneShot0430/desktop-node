import { Action } from 'redux';

export type ModalType = 'CREATE_TASK';

export interface IModalState {
  isShown: boolean;
  modalType: ModalType;
}

export interface ModalAction extends Action<string> {
  payload?: ModalType;
}
