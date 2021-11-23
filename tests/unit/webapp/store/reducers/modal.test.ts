import { HIDE_MODAL, SHOW_MODAL } from 'webapp/store/actions/types';
import modalReducer from 'webapp/store/reducers/modal';

describe('Modal reducer', () => {
  describe('Handle SHOW_MODAL', () => {
    it('returns new state with is shown and the correct modal type', () => {
      expect(
        modalReducer(null, { type: SHOW_MODAL, payload: 'CREATE_TASK' })
      ).toEqual({
        isShown: true,
        modalType: 'CREATE_TASK',
      });
    });
  });

  describe('Handle HIDE_MODAL', () => {
    it('return initial state', () => {
      expect(modalReducer(null, { type: HIDE_MODAL })).toEqual({
        isShown: false,
        modalType: 'CREATE_TASK',
      });
    });
  });

  describe('Handle default case', () => {
    it('return initial state', () => {
      expect(modalReducer(undefined, { type: '' })).toEqual({
        isShown: false,
        modalType: 'CREATE_TASK',
      });
    });
  });
});
