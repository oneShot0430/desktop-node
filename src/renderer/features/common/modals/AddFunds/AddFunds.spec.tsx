import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { createServer, Server } from 'miragejs';
import React from 'react';

import config from 'config';
import { SidebarActions } from 'renderer/features/sidebar/components';
import { openBrowserWindow } from 'renderer/services';
import { render } from 'renderer/tests/utils';
import { StatusResponse, ValidationStatus } from 'renderer/types';

const { FAUCET_API_URL, FAUCET_URL } = config.faucet;

const publicKey = 'myPublicKey';

const baseFaucetState: StatusResponse = {
  walletAddress: publicKey,
  discordValidation: ValidationStatus.NOT_CLAIMED,
  emailValidation: ValidationStatus.NOT_CLAIMED,
  githubValidation: ValidationStatus.NOT_CLAIMED,
  twitterValidation: ValidationStatus.NOT_CLAIMED,
  referral: ValidationStatus.NOT_CLAIMED,
};

jest.mock('renderer/services', () => ({
  __esModule: true, // necessary to make it work, otherwise it fails trying to set the spy
  ...jest.requireActual('renderer/services'),
  openBrowserWindow: jest.fn(),
}));

const openBrowserWindowMock = openBrowserWindow as jest.Mock;

Object.defineProperty(window, 'main', {
  value: {
    getMainAccountPubKey: jest.fn(() => Promise.resolve(publicKey)),
    openBrowserWindow: jest.fn(),
  },
});

const copyToClipboard = jest.fn();
Object.defineProperty(navigator, 'clipboard', {
  value: {
    writeText: copyToClipboard,
  },
});

let server: Server;

beforeEach(() => {
  server = createServer({
    environment: 'test',
    urlPrefix: FAUCET_API_URL,
  });
});

afterEach(() => {
  server.shutdown();
});

const renderWithFaucetStateMock = (faucetState: StatusResponse) => {
  server.get(`/get-user-faucet-state/${publicKey}`, () => faucetState);
  render(
    <SidebarActions
      onPrimaryActionClick={() => {
        return '';
      }}
      onSecondaryActionClick={() => {
        return '';
      }}
    />
  );
};

// eslint-disable-next-line jest/no-disabled-tests
describe('AddFunds', () => {
  it('displays the right modal content if the user has completed at least 1 validation method from the faucet', async () => {
    const faucetState: StatusResponse = {
      ...baseFaucetState,
      twitterValidation: ValidationStatus.CLAIMED,
    };
    renderWithFaucetStateMock(faucetState);

    const addFundsButton = screen.getByTestId('sidebar_tip_give_button');
    await userEvent.click(addFundsButton);

    const copyForOneMethodCompleted = await screen.findByText(
      /Return to the Faucet to get the rest of your free KOII./i
    );

    expect(copyForOneMethodCompleted).toBeInTheDocument();
  });

  it('displays the right modal content if the user has not completed any validation method from the faucet', async () => {
    renderWithFaucetStateMock(baseFaucetState);

    const addFundsButton = screen.getByTestId('sidebar_tip_give_button');
    await userEvent.click(addFundsButton);

    const copyForNoMethodsCompleted = await screen.findByText(
      /Go to the faucet to get some free KOII. At least 2 KOII will be enough to cover task fees and get you started!/i
    );

    expect(copyForNoMethodsCompleted).toBeInTheDocument();
  });

  it('displays the right modal content if the user has completed all the validation methods from the faucet', async () => {
    const faucetState = {
      ...baseFaucetState,
      discordValidation: ValidationStatus.CLAIMED,
      emailValidation: ValidationStatus.CLAIMED,
      githubValidation: ValidationStatus.CLAIMED,
      twitterValidation: ValidationStatus.CLAIMED,
    };
    renderWithFaucetStateMock(faucetState);

    const addFundsButton = screen.getByTestId('sidebar_tip_give_button');
    await userEvent.click(addFundsButton);

    const copyForAllMethodsCompleted = await screen.findByText(
      /Move KOII with Finnie. Copy your address to send your account some love./i
    );

    expect(copyForAllMethodsCompleted).toBeInTheDocument();
  });

  it('calls the service that opens the faucet in a new window when clicking on `Get My Free Tokens` button', async () => {
    const faucetState: StatusResponse = {
      ...baseFaucetState,
      twitterValidation: ValidationStatus.CLAIMED,
    };
    renderWithFaucetStateMock(faucetState);

    const addFundsButton = screen.getByTestId('sidebar_tip_give_button');
    await userEvent.click(addFundsButton);

    const getMyFreeTokensButton = await screen.findByText(
      /Get My Free Tokens/i
    );
    await userEvent.click(getMyFreeTokensButton);

    expect(openBrowserWindowMock).toHaveBeenCalledWith(
      `${FAUCET_URL}?key=${publicKey}`
    );
  });

  it('copies the public key to the clipboard when clicking on the `copy` button', async () => {
    const faucetState: StatusResponse = {
      ...baseFaucetState,
      twitterValidation: ValidationStatus.CLAIMED,
    };
    renderWithFaucetStateMock(faucetState);

    const addFundsButton = screen.getByTestId('sidebar_tip_give_button');
    await userEvent.click(addFundsButton);

    const copyButton = await screen.getByRole('button', {
      name: /copy/i,
    });
    await userEvent.click(copyButton);

    expect(copyToClipboard).toHaveBeenCalledWith(publicKey);
  });
});
