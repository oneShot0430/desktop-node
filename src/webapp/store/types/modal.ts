import { Action } from 'redux';

export type ModalType =
  | 'WITHDRAW_STAKE'
  | 'EDIT_STAKE_AMOUNT'
  | 'ADD_NEW_KEY'
  | 'ADD_FUNDS_QR'
  | 'NOT_ENOUGH_FUNDS';

export type ModalPayload = {
  modalType: ModalType | null;
  data?: any;
};

export interface IModalState {
  isShown: boolean;
  modalData: ModalPayload;
}

export interface ModalAction extends Action<string> {
  payload?: ModalPayload;
}
