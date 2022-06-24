import { Action } from 'redux';

export type ModalType = 'CREATE_TASK' | 'WITHDRAW_STAKE' | 'EDIT_STAKE_AMOUNT';

export type ModalPayload = {
  modalType: ModalType | null;
  taskInfo?: { name: string; creator: string; rewardEarned: number };
};

export interface IModalState {
  isShown: boolean;
  modalData: ModalPayload;
}

export interface ModalAction extends Action<string> {
  payload?: ModalPayload;
}
