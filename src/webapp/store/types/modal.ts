import { Action } from 'redux';

export type ModalType = 'CREATE_TASK' | 'WITHDRAW_STAKE';

export type ModalPayload = {
  modalType: 'WITHDRAW_STAKE' | 'CREATE_TASK' | null;
  taskInfo?: { name: string; creator: string; rewardEarned: number };
};

export interface IModalState {
  isShown: boolean;
  modalData: ModalPayload;
}

export interface ModalAction extends Action<string> {
  payload?: ModalPayload;
}
