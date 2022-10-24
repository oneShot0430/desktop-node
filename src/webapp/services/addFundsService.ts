import axios from 'axios';

import { FAUCET_API_URL } from 'webapp/../constants';
import { StatusResponse } from 'webapp/types';

export const getFaucetStatus = async (walletAddress: string) => {
  const { data } = await axios.get<StatusResponse>(
    `${FAUCET_API_URL}/get-user-faucet-state/${walletAddress}`
  );
  return data;
};

export const openFaucet = async (publicKey: string) => {
  await window.main.openFaucet({ publicKey });
};
