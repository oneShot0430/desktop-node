import { showModal, closeModal } from 'webapp/store/actions/modal';
import { HIDE_MODAL, SHOW_MODAL } from 'webapp/store/actions/types';

describe('Modal action', () => {
  describe('Show Create Task Modal', () => {
    it('return action with the correct payload', () => {
      expect(showModal('CREATE_TASK')).toEqual({
        type: SHOW_MODAL,
        payload: {
          modalType: 'CREATE_TASK',
        },
      });
    });
  });

  describe('Hide Modal', () => {
    it('return HIDE_MODAL action', () => {
      expect(closeModal()).toEqual({
        type: HIDE_MODAL,
      });
    });
  });
});
