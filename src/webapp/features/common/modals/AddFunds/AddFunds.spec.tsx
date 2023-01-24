import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { createServer, Server } from 'miragejs';
import React from 'react';

import config from 'config';
import { Actions } from 'webapp/components/Sidebar/components/Actions';
import { openBrowserWindow } from 'webapp/services';
import { render } from 'webapp/tests/utils';
import { StatusResponse, ValidationStatus } from 'webapp/types';

const { FAUCET_API_URL, FAUCET_URL } = config.faucet;

const publicKey = 'myPublicKey';

const baseFaucetState: StatusResponse = {
  walletAddress: publicKey,
  discordValidation: ValidationStatus.NOT_CLAIMED,
  emailValidation: ValidationStatus.NOT_CLAIMED,
  phoneValidation: ValidationStatus.NOT_CLAIMED,
  twitterValidation: ValidationStatus.NOT_CLAIMED,
};

jest.mock('webapp/services', () => ({
  __esModule: true, // necessary to make it work, otherwise it fails trying to set the spy
  ...jest.requireActual('webapp/services'),
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
  render(<Actions />);
};

describe('AddFunds', () => {
  it('displays the right modal content if the user has completed at least 1 validation method from the faucet', async () => {
    const faucetState: StatusResponse = {
      ...baseFaucetState,
      twitterValidation: ValidationStatus.CLAIMED,
    };
    renderWithFaucetStateMock(faucetState);

    const addFundsButton = screen.getByText(/Add Funds/i);
    await userEvent.click(addFundsButton);

    const copyForOneMethodCompleted = await screen.findByText(
      /Return to the Faucet to get the rest of your free KOII./i
    );

    expect(copyForOneMethodCompleted).toBeInTheDocument();
  });

  it('displays the right modal content if the user has not completed any validation method from the faucet', async () => {
    renderWithFaucetStateMock(baseFaucetState);

    const addFundsButton = screen.getByText(/Add Funds/i);
    await userEvent.click(addFundsButton);

    const copyForNoMethodsCompleted = await screen.findByText(
      /Go to the Faucet for some free KOII to get started./i
    );

    expect(copyForNoMethodsCompleted).toBeInTheDocument();
  });

  it('displays the right modal content if the user has completed all the validation methods from the faucet', async () => {
    const faucetState = {
      ...baseFaucetState,
      discordValidation: ValidationStatus.CLAIMED,
      emailValidation: ValidationStatus.CLAIMED,
      phoneValidation: ValidationStatus.CLAIMED,
      twitterValidation: ValidationStatus.CLAIMED,
    };
    renderWithFaucetStateMock(faucetState);

    const addFundsButton = screen.getByText(/Add Funds/i);
    await userEvent.click(addFundsButton);

    const copyForAllMethodsCompleted = await screen.findByText(
      /Scan the QR code or copy the address to send tokens to your node account./i
    );

    expect(copyForAllMethodsCompleted).toBeInTheDocument();
  });

  it('calls the service that opens the faucet in a new window when clicking on `Get My Free Tokens` button', async () => {
    const faucetState: StatusResponse = {
      ...baseFaucetState,
      twitterValidation: ValidationStatus.CLAIMED,
    };
    renderWithFaucetStateMock(faucetState);

    const addFundsButton = screen.getByText(/Add Funds/i);
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

    const addFundsButton = screen.getByText(/Add Funds/i);
    await userEvent.click(addFundsButton);

    const copyButton = await screen.findByText(/copy/i);
    await userEvent.click(copyButton);

    expect(copyToClipboard).toHaveBeenCalledWith(publicKey);
  });
});
