import { SHOW_MODAL, HIDE_MODAL } from 'webapp/store/actions/types';
import { IModalState, ModalAction } from 'webapp/store/types/modal';

const initialState: IModalState = {
  isShown: false,
  modalData: {
    modalType: null,
  },
};

export default function modalReducer(
  state = initialState,
  action: ModalAction
): IModalState {
  const { type, payload } = action;

  switch (type) {
    case SHOW_MODAL:
      return { ...state, isShown: true, modalData: payload };

    case HIDE_MODAL:
      return initialState;

    default:
      return state;
  }
}
