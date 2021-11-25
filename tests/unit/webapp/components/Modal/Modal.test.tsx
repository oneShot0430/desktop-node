import React from 'react';

import Modal from 'webapp/components/Modal';

import { act, render, fireEvent, screen } from '../../test-utils';

describe('Modal', () => {
  describe('User clicks outside while the Modal is showing', () => {
    it('close the modal', async () => {
      render(
        <div role="document">
          <Modal />
        </div>,
        {
          preloadedState: {
            modal: {
              isShown: true,
              modalData: { modalType: 'CREATE_TASK' },
            },
          },
        }
      );

      expect(
        screen.getByText(/Create your own Koii Tasks/i)
      ).toBeInTheDocument();

      await act(async () => {
        await fireEvent.mouseDown(document);
      });

      expect(
        screen.queryByText(/Create your own Koii Tasks/i)
      ).not.toBeInTheDocument();
    });
  });
});
