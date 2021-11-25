import { HIDE_MODAL, SHOW_MODAL } from 'webapp/store/actions/types';
import modalReducer from 'webapp/store/reducers/modal';

describe('Modal reducer', () => {
  describe('Handle SHOW_MODAL', () => {
    it('returns new state with is shown and the correct modal type', () => {
      expect(
        modalReducer(null, {
          type: SHOW_MODAL,
          payload: { modalType: 'CREATE_TASK' },
        })
      ).toEqual({
        isShown: true,
        modalData: {
          modalType: 'CREATE_TASK',
        },
      });
    });
  });

  describe('Handle HIDE_MODAL', () => {
    it('return initial state', () => {
      expect(modalReducer(undefined, { type: HIDE_MODAL })).toEqual({
        isShown: false,
        modalData: { modalType: null },
      });
    });
  });

  describe('Handle default case', () => {
    it('return initial state', () => {
      expect(modalReducer(undefined, { type: 'AnyType' })).toEqual({
        isShown: false,
        modalData: { modalType: null },
      });
    });
  });
});
