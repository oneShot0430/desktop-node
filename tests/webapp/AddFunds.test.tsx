import { screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { createServer, Server } from 'miragejs';
import React from 'react';

import { Actions } from 'webapp/components/Sidebar/components/Actions';
import { FAUCET_URL, FAUCET_API_URL } from 'webapp/constants';
import { StatusResponse, ValidationStatus } from 'webapp/types';

import { render } from './utils';

const windowOpenSpy = jest.spyOn(window, 'open');
const publicKey = 'myPublicKey';
const faucetUrl = `${FAUCET_URL}${publicKey}`;
const baseFaucetState: StatusResponse = {
  walletAddress: publicKey,
  discordValidation: ValidationStatus.NOT_CLAIMED,
  emailValidation: ValidationStatus.NOT_CLAIMED,
  phoneValidation: ValidationStatus.NOT_CLAIMED,
  twitterValidation: ValidationStatus.NOT_CLAIMED,
};

Object.defineProperty(window, 'main', {
  value: { getMainAccountPubKey: () => Promise.resolve(publicKey) },
});
// we can't spy on primitive values, so we need to override clipboard.writeText
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
  it('displays the right modal content if the user has not completed any validation method from the faucet', async () => {
    renderWithFaucetStateMock(baseFaucetState);

    const addFundsButton = screen.getByText(/Add Funds/i);
    userEvent.click(addFundsButton);
    const copyForNoMethodsCompleted = await screen.findByText(
      /Go to the Faucet for some free KOII to get started./i
    );

    expect(copyForNoMethodsCompleted).toBeInTheDocument();
  });

  it('displays the right modal content if the user has completed at least 1 validation method from the faucet', async () => {
    const faucetState: StatusResponse = {
      ...baseFaucetState,
      twitterValidation: ValidationStatus.CLAIMED,
    };
    renderWithFaucetStateMock(faucetState);

    const addFundsButton = screen.getByText(/Add Funds/i);
    userEvent.click(addFundsButton);
    const copyForOneMethodCompleted = await screen.findByText(
      /Return to the Faucet to get the rest of your free KOII./i
    );

    expect(copyForOneMethodCompleted).toBeInTheDocument();
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
    userEvent.click(addFundsButton);
    const copyForAllMethodsCompleted = await screen.findByText(
      /Scan the QR code or copy the address to send tokens to your node account./i
    );

    expect(copyForAllMethodsCompleted).toBeInTheDocument();
  });

  it('opens the faucet in a new window when clicking on `Get My Free Tokens` button', async () => {
    const faucetState: StatusResponse = {
      ...baseFaucetState,
      twitterValidation: ValidationStatus.CLAIMED,
    };
    renderWithFaucetStateMock(faucetState);

    const addFundsButton = screen.getByText(/Add Funds/i);
    userEvent.click(addFundsButton);
    const getMyFreeTokensButton = await screen.findByText(
      /Get My Free Tokens/i
    );
    userEvent.click(getMyFreeTokensButton);

    waitFor(() => {
      expect(windowOpenSpy).toHaveBeenCalledWith(
        faucetUrl,
        undefined,
        'height=992,width=1512'
      );
    });
  });

  it('copies the public key to the clipboard when clicking on the `copy` button', async () => {
    const faucetState: StatusResponse = {
      ...baseFaucetState,
      twitterValidation: ValidationStatus.CLAIMED,
    };
    renderWithFaucetStateMock(faucetState);

    const addFundsButton = screen.getByText(/Add Funds/i);
    userEvent.click(addFundsButton);
    const copyButton = await screen.findByText(/copy/i);
    userEvent.click(copyButton);

    waitFor(() => {
      expect(copyToClipboard).toHaveBeenCalledWith(publicKey);
    });
  });
});
