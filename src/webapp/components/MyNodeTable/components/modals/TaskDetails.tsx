import React from 'react';

import { getKoiiFromRoe } from 'utils';

type PropsType = {
  owner: string;
  totalBounty: number;
  nodesParticipating: number;
  totalKoiiStaked: number;
  currentTopStake: number;
  myCurrentStake: number;
  state: string;
  myTotalRewards: number;
};

const PropertyRow = ({ label, value }: { label: string; value: string }) => (
  <div className="flex items-center mb-1 text-left justify-left">
    <div className="w-[200px]">{`${label}:`}</div>
    <div className="w-[200px] font-semibold text-left text-finnieEmerald-light">
      {value}
    </div>
  </div>
);

export const TaskDetails = ({
  owner,
  totalBounty,
  nodesParticipating,
  totalKoiiStaked,
  currentTopStake,
  myCurrentStake,
  state,
  myTotalRewards,
}: PropsType) => (
  <div>
    <PropertyRow label="Owner" value={owner} />
    <PropertyRow
      label={'Total bounty'}
      value={`${getKoiiFromRoe(totalBounty)} KOII`}
    />
    <PropertyRow
      label={'Nodes participating'}
      value={`${nodesParticipating}`}
    />
    <PropertyRow
      label={'Total KOII staked'}
      value={`${getKoiiFromRoe(totalKoiiStaked)} KOII`}
    />
    <PropertyRow
      label={'Current top stake'}
      value={`${getKoiiFromRoe(currentTopStake)} KOII`}
    />
    <PropertyRow
      label={'My current stake'}
      value={`${getKoiiFromRoe(myCurrentStake)} KOII`}
    />
    <PropertyRow label={'State'} value={state} />
    <PropertyRow
      label={'My total rewards'}
      value={`${getKoiiFromRoe(myTotalRewards)} KOII`}
    />
  </div>
);
