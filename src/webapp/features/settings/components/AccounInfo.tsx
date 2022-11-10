import React, { memo } from 'react';

import CopyIconSvg from 'assets/svgs/copy-icon.svg';
import DeleteIconSvg from 'assets/svgs/delete-icon.svg';
import DotsSvg from 'assets/svgs/dots.svg';
import EditIconSvg from 'assets/svgs/edit-icon.svg';
import KeyIconSvg from 'assets/svgs/key-icon.svg';
import StarOutlined from 'assets/svgs/star-outlined.svg';
import Star from 'assets/svgs/star.svg';
import { Button } from 'webapp/components/ui/Button';
import { ErrorMessage } from 'webapp/components/ui/ErrorMessage';
import { useClipboard } from 'webapp/features/common';

import { useAccount } from '../hooks/useAccount';
import { useAccountBalance } from '../hooks/useAccountBalance';

type PropsType = {
  accountName: string;
  stakingPublicKey: string;
  mainPublicKey: string;
  isDefault: boolean;
  stakingPublicKeyBalance: number;
};

const AccountInfo = ({
  accountName,
  mainPublicKey,
  stakingPublicKey,
  isDefault,
}: PropsType) => {
  const { accountBalance, accountBalanceLoadingError } =
    useAccountBalance(mainPublicKey);
  const { copyToClipboard: copyMainKeyToClipboard, copied: copiedMainKey } =
    useClipboard();
  const {
    copyToClipboard: copyStakingKeyToClipboard,
    copied: copiedStakingKey,
  } = useClipboard();
  const {
    deleteAccount,
    setAccountActive,
    removingAccountError,
    setAccountActiveError,
  } = useAccount(accountName);

  const handleCopyMainPublicKey = () => {
    copyMainKeyToClipboard(mainPublicKey);
  };
  const handleCopyStakingPublicKey = () => {
    copyStakingKeyToClipboard(stakingPublicKey);
  };

  const error =
    (removingAccountError as string) || (setAccountActiveError as string);

  return (
    <div className="w-full mb-4 text-white">
      <div className="pb-2 pl-12 text-xl font-semibold">{accountName}</div>
      {error && <ErrorMessage errorMessage={error} />}
      <div
        className={`rounded ${
          isDefault ? 'bg-finnieTeal-100/[.3]' : 'bg-finnieTeal-100'
        } bg-opacity-5 grid grid-cols-16 gap-y-6 gap-x-2 py-4`}
      >
        <div className="flex flex-col items-center justify-center py-1 col-span-1 row-span-2">
          <DotsSvg />
        </div>
        <Button
          onClick={setAccountActive}
          icon={isDefault ? <Star /> : <StarOutlined />}
          className="rounded-full w-6 h-6 bg-transparent col-span-1"
        />
        <span className="text-finnieTeal col-span-2">System Key</span>
        <Button
          icon={<EditIconSvg />}
          className="rounded-full w-6 h-6 bg-finnieTeal-100 col-span-1"
        />
        <span
          className="col-span-5 text-ellipsis overflow-x-clip"
          title={mainPublicKey}
        >
          {mainPublicKey}
        </span>
        <div className="flex justify-center gap-4 col-span-2">
          <Button
            tooltip="Copy"
            onClick={handleCopyMainPublicKey}
            icon={<CopyIconSvg />}
            /**
             * @todo implement better copy action ux
             */
            className={`rounded-full w-6 h-6 ${
              copiedMainKey ? 'bg-finnieEmerald' : 'bg-finnieTeal-100'
            }`}
          />
          <Button
            icon={<KeyIconSvg className="w-3.5 h-3.5" />}
            className="rounded-full w-6 h-6 bg-finnieEmerald-light"
          />
        </div>

        <span className="col-start-14 col-span-2">
          {accountBalanceLoadingError ? '-' : accountBalance} KOII
        </span>
        <Button
          onClick={deleteAccount}
          icon={<DeleteIconSvg />}
          className="rounded-full w-6 h-6 bg-finnieRed col-span-1"
        />

        <div className="text-finnieOrange col-start-3 col-span-2">
          Staking Key
        </div>

        <Button
          icon={<EditIconSvg />}
          className="rounded-full w-6 h-6 bg-finnieTeal-100  col-span-1"
        />
        <div
          className="col-start-6 col-span-5 text-ellipsis overflow-x-clip"
          title={stakingPublicKey}
        >
          {stakingPublicKey}
        </div>
        <div className="flex justify-center gap-4 col-span-2">
          <Button
            tooltip="Copy"
            onClick={handleCopyStakingPublicKey}
            icon={<CopyIconSvg />}
            /**
             * @todo implement better copy action ux
             */
            className={`rounded-full w-6 h-6 ${
              copiedStakingKey ? 'bg-finnieEmerald' : 'bg-finnieTeal-100'
            }`}
          />
          <Button
            icon={<KeyIconSvg className="w-3.5 h-3.5" />}
            className="rounded-full w-6 h-6 bg-finnieEmerald-light"
          />
        </div>
      </div>
    </div>
  );
};

export default memo(AccountInfo);
