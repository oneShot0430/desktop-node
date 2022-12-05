import React, { useState } from 'react';

import AddIconSvg from 'assets/svgs/add-icon-outlined.svg';
import HideIconSvg from 'assets/svgs/hide-icon-blue.svg';
import { Button } from 'webapp/components';
import { Table } from 'webapp/components/ui/Table';

import { useShowAllSecretsModal } from '../modals';

import { SecretRow } from './SecretRow';

export type SecretType = {
  name: string;
  value: string;
};

type PropsType = {
  secrets?: Array<SecretType>;
  onCreateClick?: () => void;
};

export const SecretsTable = ({ secrets = [], onCreateClick }: PropsType) => {
  const [revealAll, setRevealAll] = useState(false);
  const handleRevealAll = () => {
    setRevealAll(true);
  };
  const { showModal } = useShowAllSecretsModal({ onReveal: handleRevealAll });
  const handleShowAllSecrets = () => {
    showModal();
  };
  return (
    <>
      <Table
        className="max-h-[54vh]"
        tableHeaders={[
          'Name',
          'Secret',
          <Button
            className="bg-finnieTeal-100 rounded-[50%] w-[24px] h-[24px] cursor-pointer"
            key={'showAllAction'}
            onClick={() => handleShowAllSecrets()}
            icon={<HideIconSvg />}
          />,
        ]}
      >
        {secrets.map(({ name, value }) => (
          <SecretRow
            name={name}
            secret={value}
            key={`${value}${name}`}
            reveal={revealAll}
          />
        ))}
      </Table>
      <Button
        label="New"
        className="w-auto p-2 bg-transparent h-[60px] text-white"
        icon={<AddIconSvg />}
        onClick={onCreateClick}
      />
    </>
  );
};
