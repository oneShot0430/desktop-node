import React from 'react';

import DeleteIconSvg from 'assets/svgs/delete-icon.svg';
import HideIconSvg from 'assets/svgs/hide-icon-blue.svg';
import { DotsMask } from 'webapp/components';
import { Button } from 'webapp/components/ui/Button';
import { TableCell, TableRow } from 'webapp/components/ui/Table';

import { useShowSecretModal } from '../modals';

type PropsType = {
  name: string;
  secret: string;
  reveal?: boolean;
};

export const SecretRow = ({ name, secret, reveal }: PropsType) => {
  const { showModal } = useShowSecretModal({
    secretKeyName: name,
    secretValue: secret,
  });

  const handleDeleteSecret = () => {
    console.log('delete secret');
  };

  const handleShowSecret = () => {
    showModal();
  };

  return (
    <TableRow>
      <TableCell className="w-[30%] text-finnieTeal font-semibold text-base">
        {name}
      </TableCell>
      <TableCell className="w-[70%]">
        {reveal ? secret : <DotsMask amount={6} />}
      </TableCell>
      <TableCell>
        <div className="flex flex-row items-center gap-8 pr-4">
          <Button
            className="bg-finnieTeal-100 rounded-[50%] w-[24px] h-[24px] cursor-pointer"
            key={'showAllAction'}
            onClick={() => handleShowSecret()}
            icon={<HideIconSvg />}
          />
          <Button
            onClick={handleDeleteSecret}
            icon={<DeleteIconSvg />}
            className="rounded-[50%] w-[24px] h-[24px] bg-finnieRed"
          />
        </div>
      </TableCell>
    </TableRow>
  );
};
