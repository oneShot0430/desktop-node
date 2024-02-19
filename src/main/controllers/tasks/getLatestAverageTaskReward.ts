import { PublicKey, AccountInfo } from '@_koi/web3.js';
import max from 'lodash/max';
import sdk from 'main/services/sdk';
import { Task } from 'renderer/types';

async function getDistributionList(
  publicKey: string,
  round: string,
  taskId: string
): Promise<string | null> {
  let accountInfo: AccountInfo<Buffer> | null = null;
  try {
    // FIXME: calls K2
    accountInfo = await sdk.k2Connection.getAccountInfo(
      new PublicKey(publicKey)
    );
    if (!accountInfo) {
      console.log(`${publicKey} doesn't contain any distribution list data`);
      return null;
    }
    const d = JSON.parse(`${accountInfo.data}`) as any;
    const i = Buffer.from(d[round][taskId]).indexOf(0x00);
    const t = Buffer.from(d[round][taskId]).slice(0, i);

    const origData = JSON.stringify(new TextDecoder().decode(t));
    return origData;
  } catch (err) {
    console.log('ERROR', err);
    return null;
  }
}

export const getLatestAverageTaskReward = async (
  _: Event,
  payload: { task: Task }
) => {
  const { task } = payload;
  const { distributionRewardsSubmission } = task;
  const latestRound: number = max(
    Object.keys(distributionRewardsSubmission).map((k) => parseInt(k, 10))
  ) as number;

  if (Object.keys(distributionRewardsSubmission).length === 0) {
    return null;
  }

  const highestValueProperty = distributionRewardsSubmission[latestRound];

  if (Object.keys(highestValueProperty).length === 0) {
    return null;
  }

  const submissionValue = (Object.values(highestValueProperty)[0] as any)
    .submission_value;

  const distributionList = await getDistributionList(
    submissionValue,
    latestRound.toString(),
    task.publicKey
  );

  const distributions = JSON.parse(
    JSON.parse(distributionList as string) as string
  );

  const filteredValues = (
    Object.values(distributions as any) as string[]
  ).filter((value) => Number(value) > 0);

  const distributionsTotalSum = filteredValues.reduce(
    (a, b) => Number(a) + Number(b),
    0
  );

  const result = distributionsTotalSum / filteredValues.length;

  return result;
};
