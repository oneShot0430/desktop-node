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

type TriggerRedemptionResponseType = {
  message: string;
};

type TriggerRedemptionParams = {
  stakingWallet: string;
  mainWallet: string;
};

export async function triggerRedemption({
  stakingWallet,
  mainWallet,
}: TriggerRedemptionParams) {
  const { data } = await axios.post<TriggerRedemptionResponseType>(
    `${FAUCET_API_URL}/triggerRedemption`,

    {
      stakingWallet,
      mainWallet,
    }
  );
  return data;
}

export async function getOnboardingTaskIds() {
  const { data } = await axios.get<{ taskID: string }>(
    `${FAUCET_API_URL}/get-onboarding-task-id`
  );
  return data?.taskID ? [data.taskID] : [];
}
