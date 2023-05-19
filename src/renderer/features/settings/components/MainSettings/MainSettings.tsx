import React from 'react';

import { Network } from './Network';
import { Referral } from './Referral';

const lastCommitSha =
  (typeof process !== 'undefined' && process.env.COMMIT_SHA) || '';

export function MainSettings() {
  return (
    <div className="flex flex-col gap-7 text-white h-full text-sm">
      <Referral />
      <Network />

      {lastCommitSha && <div className="">version: {lastCommitSha}</div>}
    </div>
  );
}
