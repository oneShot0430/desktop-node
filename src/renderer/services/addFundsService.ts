import axios from 'axios';
import config from 'config';
import { StatusResponse } from 'renderer/types';

const { FAUCET_API_URL } = config.faucet;

export const getFaucetStatus = async (walletAddress: string) => {
  if (walletAddress) {
    const {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      data: { referral, ...faucetStatus },
    } = await axios.get<StatusResponse>(
      `${FAUCET_API_URL}/get-user-faucet-state/${walletAddress}`
    );
    return faucetStatus;
  }
};
