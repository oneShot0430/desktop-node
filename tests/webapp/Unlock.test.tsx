import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import React from 'react';

import { Unlock } from 'webapp/components/Unlock';

import { render } from './utils';

jest.mock('webapp/services', () => ({
  __esModule: true,
  ...jest.requireActual('webapp/services'),
}));

const pinErrorMessage = 'The PINs don’t match. Let’s try again.';
const pin = '111111';
const hashedPin =
  '$2a$10$A6AnKXS0/0eikAGxI9PpL.qwnVJ/x2PDGgH.oJ.8IeKdWszLcQ0Bu';

Object.defineProperty(window, 'main', {
  value: {
    getUserConfig: () =>
      Promise.resolve({
        onboardingCompleted: true,
        pin: hashedPin,
      }),
  },
});

describe('Unlock page', () => {
  it('fails authentication if the pin entered does not match the hash stored', async () => {
    render(<Unlock />);

    const enterIncorrectPin = async () => {
      // if we can make it work with forEach/map would be awesome, but I tried a zillion different things and it failed everytime (something related to asynchronicity in those methods during tests unlike with regular for)
      for (let index = 0; index < 6; index++) {
        const pinInput = screen.getAllByLabelText(/pin-input/i)[index];
        await userEvent.type(pinInput, String(index));
      }
    };

    await enterIncorrectPin();
    const errorElement = await screen.findByText(pinErrorMessage);
    expect(errorElement).toBeInTheDocument();
  });

  // TO DO: assesst redirection to MyNode instead
  it('does not fail authentication if the pin entered does not match the hash stored', async () => {
    render(<Unlock />);

    const enterCorrectPin = async () => {
      for (let index = 0; index < 6; index++) {
        const pinCharacterToEnter = pin[index];
        const pinInput = screen.getAllByLabelText(/pin-input/i)[index];
        await userEvent.type(pinInput, pinCharacterToEnter);
      }
    };

    await enterCorrectPin();
    const errorElement = screen.queryByText(pinErrorMessage);
    expect(errorElement).not.toBeInTheDocument();
  });
});
