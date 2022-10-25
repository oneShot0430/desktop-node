import axios from 'axios';

import config from 'config';
import { StatusResponse } from 'webapp/types';

const { FAUCET_API_URL } = config.faucet;

export const getFaucetStatus = async (walletAddress: string) => {
  const { data } = await axios.get<StatusResponse>(
    `${FAUCET_API_URL}/get-user-faucet-state/${walletAddress}`
  );
  return data;
};

export const openFaucet = async (publicKey: string) => {
  await window.main.openFaucet({ publicKey });
};
