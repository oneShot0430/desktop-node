import React from 'react';

import { AccountsTable } from '../KeyManagement';
import { SectionHeader } from '../SectionHeader';
import { Spacer } from '../Spacer';

import { UpdatePin } from './UpdatePin';

export function SecuritySettings() {
  return (
    <div className="overflow-y-auto text-white">
      <SectionHeader title="Security" />
      <UpdatePin />
      <Spacer size="lg" />
      <SectionHeader title="Accounts" />
      <AccountsTable />
    </div>
  );
}
