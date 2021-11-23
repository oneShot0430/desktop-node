import React from 'react';

import Modal from 'webapp/components/Modal';

// eslint-disable-next-line import/namespace
import { render, screen } from '../../test-utils';

describe('Modal', () => {
  describe('Initial state is shown is true', () => {
    it('shows the modal', () => {
      render(<Modal />, {
        preloadedState1: {
          modal: {
            isShown: true,
            modalType: 'CREATE_TASK',
          },
        },
      });

      screen.debug();
    });
  });
});
