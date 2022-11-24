import React, { memo, useState } from 'react';

import CopyIconSvg from 'assets/svgs/copy-icon.svg';
import DeleteIconSvg from 'assets/svgs/delete-icon.svg';
import DotsSvg from 'assets/svgs/dots.svg';
import EditIconSvg from 'assets/svgs/edit-icon.svg';
import KeyIconSvg from 'assets/svgs/key-icon.svg';
import StarOutlined from 'assets/svgs/star-outlined.svg';
import Star from 'assets/svgs/star.svg';
import {
  LoadingSpinner,
  LoadingSpinnerSize,
  ErrorMessage,
  Button,
} from 'webapp/components';
import { useClipboard } from 'webapp/features/common';
import { useConfirmModal } from 'webapp/features/common/modals/ConfirmationModal';

import { useAccount } from '../hooks/useAccount';
import { useAccountBalance } from '../hooks/useAccountBalance';

type PropsType = {
  accountName: string;
  stakingPublicKey: string;
  mainPublicKey: string;
  isDefault: boolean;
  stakingPublicKeyBalance: number;
};

const AccountItem = ({
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
    setAccountActiveLoading,
    removingAccountError,
    setAccountActiveError,
    // removingAccountLoading,
  } = useAccount({ accountName, isDefault });

  const [isDeleting, setIsDeleting] = useState(false);

  const { showModal } = useConfirmModal({
    content: (
      <div className="flex justify-center px-4 py-10">
        <div className="text-left">
          <p>
            Are you sure you want to delete{' '}
            <span className="text-lg text-finnieTeal">{accountName}</span>?
          </p>
          <br></br>
          If you want to use this account in the future, you will <br /> need to
          import it again using the secret phrase.
        </div>
      </div>
    ),
    title: 'Delete Account',
  });

  const handleDeleteAccount = async () => {
    const isConfirmed = await showModal();
    if (isConfirmed) {
      setIsDeleting(true);
      await deleteAccount();
    }
  };

  const handleCopyMainPublicKey = () => {
    copyMainKeyToClipboard(mainPublicKey);
  };
  const handleCopyStakingPublicKey = () => {
    copyStakingKeyToClipboard(stakingPublicKey);
  };

  const error = removingAccountError || setAccountActiveError;

  return (
    <div className="w-full mb-4 text-white">
      <div className="pb-2 pl-12 text-xl font-semibold">{accountName}</div>
      {error && <ErrorMessage error={error} />}
      <div
        className={`rounded ${
          isDefault ? 'bg-finnieTeal-100/[.3]' : 'bg-finnieTeal-100'
        } bg-opacity-5 grid grid-cols-16 gap-y-6 gap-x-2 py-4`}
      >
        <div className="flex flex-col items-center justify-center col-span-1 row-span-2 py-1">
          <DotsSvg />
        </div>
        {setAccountActiveLoading ? (
          <LoadingSpinner />
        ) : (
          <Button
            onClick={setAccountActive}
            icon={isDefault ? <Star /> : <StarOutlined />}
            className="w-6 h-6 col-span-1 bg-transparent rounded-full"
          />
        )}
        <span className="col-span-2 text-finnieTeal">System Key</span>
        <Button
          icon={<EditIconSvg />}
          className="invisible w-6 h-6 col-span-1 rounded-full bg-finnieTeal-100"
        />
        <span
          className="col-span-5 text-ellipsis overflow-x-clip"
          title={mainPublicKey}
        >
          {mainPublicKey}
        </span>
        <div className="flex justify-center col-span-2 gap-4">
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
            className="invisible w-6 h-6 rounded-full bg-finnieEmerald-light"
          />
        </div>

        <span className="col-span-2 col-start-14">
          {accountBalanceLoadingError ? '-' : accountBalance} KOII
        </span>
        {!isDefault &&
          (isDeleting ? (
            <LoadingSpinner size={LoadingSpinnerSize.Medium} />
          ) : (
            <Button
              disabled={isDeleting}
              onClick={handleDeleteAccount}
              icon={<DeleteIconSvg />}
              className="w-6 h-6 col-span-1 rounded-full bg-finnieRed"
            />
          ))}

        <div className="col-span-2 col-start-3 text-finnieOrange">
          Staking Key
        </div>

        <Button
          icon={<EditIconSvg />}
          className="invisible w-6 h-6 col-span-1 rounded-full bg-finnieTeal-100"
        />
        <div
          className="col-span-5 col-start-6 text-ellipsis overflow-x-clip"
          title={stakingPublicKey}
        >
          {stakingPublicKey}
        </div>
        <div className="flex justify-center col-span-2 gap-4">
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
            className="invisible w-6 h-6 rounded-full bg-finnieEmerald-light"
          />
        </div>
      </div>
    </div>
  );
};

export default memo(AccountItem);
