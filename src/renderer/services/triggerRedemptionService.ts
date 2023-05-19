import axios from 'axios';
import config from 'config';

export type TriggerRedemptionResponseType = {
  message: string;
};

export type TriggerRedemptionParams = {
  stakingWallet: string;
  mainWallet: string;
};

const { FAUCET_API_URL } = config.faucet;

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
