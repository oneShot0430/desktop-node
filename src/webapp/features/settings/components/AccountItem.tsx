import React, { memo, useState } from 'react';

import CopyIconSvg from 'assets/svgs/copy-icon.svg';
import DeleteIconSvg from 'assets/svgs/delete-icon.svg';
import DotsSvg from 'assets/svgs/dots.svg';
import StarOutlined from 'assets/svgs/star-outlined.svg';
import Star from 'assets/svgs/star.svg';
import {
  LoadingSpinner,
  LoadingSpinnerSize,
  ErrorMessage,
  Button,
  Tooltip,
  TableRow,
  ColumnsLayout,
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
  columnsLayout: ColumnsLayout;
};

const AccountItem = ({
  accountName,
  mainPublicKey,
  stakingPublicKey,
  isDefault,
  columnsLayout,
}: PropsType) => {
  const [isDeleting, setIsDeleting] = useState(false);

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
  const rowClasses = `rounded ${
    isDefault ? 'bg-finnieTeal-100/[.3]' : 'bg-finnieTeal-100'
  } bg-opacity-5 grid grid-cols-accounts gap-y-6 gap-x-2 !py-4 border-none`;

  return (
    <div className="w-full mb-4 pr-2 text-white">
      <div className="pb-2 pl-[7%] text-xl font-semibold">{accountName}</div>
      {error && <ErrorMessage error={error} />}

      <TableRow columnsLayout={columnsLayout} className={rowClasses}>
        <div className="flex flex-col items-center justify-center row-span-2 py-1">
          <DotsSvg />
        </div>
        {setAccountActiveLoading ? (
          <LoadingSpinner />
        ) : (
          <Tooltip tooltipContent="Select as active account">
            <Button
              onClick={setAccountActive}
              icon={isDefault ? <Star /> : <StarOutlined />}
              className="w-6 h-6 bg-transparent rounded-full"
            />
          </Tooltip>
        )}
        <span className="text-finnieTeal">System Key</span>
        {/* <Button
          icon={<EditIconSvg />}
          className="invisible w-6 h-6 rounded-full bg-finnieTeal-100"
        /> */}
        <span className="overflow-hidden text-ellipsis" title={mainPublicKey}>
          {mainPublicKey}
        </span>
        <div className="flex justify-center gap-4">
          <Tooltip
            tooltipContent={copiedMainKey ? 'Copied' : 'Copy'}
            forceDisplaying={copiedMainKey}
          >
            <Button
              onClick={handleCopyMainPublicKey}
              icon={<CopyIconSvg />}
              className="rounded-full w-6 h-6 bg-finnieTeal-100"
            />
          </Tooltip>
          {/* <Button
            icon={<KeyIconSvg className="w-3.5 h-3.5" />}
            className="invisible w-6 h-6 rounded-full bg-finnieEmerald-light"
          /> */}
        </div>

        <span>{accountBalanceLoadingError ? '-' : accountBalance} KOII</span>

        <div className="mr-4 ml-auto">
          {!isDefault &&
            (isDeleting ? (
              <LoadingSpinner size={LoadingSpinnerSize.Medium} />
            ) : (
              <Tooltip placement="top-left" tooltipContent="Delete account">
                <Button
                  disabled={isDeleting}
                  onClick={handleDeleteAccount}
                  icon={<DeleteIconSvg />}
                  className="w-6 h-6 rounded-full bg-finnieRed mr-0"
                />
              </Tooltip>
            ))}
        </div>
        <div></div>
        <div className="text-finnieOrange">Staking Key</div>

        {/* <Button
          icon={<EditIconSvg />}
          className="invisible w-6 h-6 rounded-full bg-finnieTeal-100"
        /> */}
        <div className="overflow-hidden text-ellipsis" title={stakingPublicKey}>
          {stakingPublicKey}
        </div>
        <div className="flex justify-center gap-4">
          <Tooltip
            tooltipContent={copiedStakingKey ? 'Copied' : 'Copy'}
            forceDisplaying={copiedStakingKey}
          >
            <Button
              onClick={handleCopyStakingPublicKey}
              icon={<CopyIconSvg />}
              className="rounded-full w-6 h-6 bg-finnieTeal-100"
            />
          </Tooltip>
          {/* <Button
            icon={<KeyIconSvg className="w-3.5 h-3.5" />}
            className="invisible w-6 h-6 rounded-full bg-finnieEmerald-light"
          /> */}
        </div>
      </TableRow>
    </div>
  );
};

export default memo(AccountItem);
