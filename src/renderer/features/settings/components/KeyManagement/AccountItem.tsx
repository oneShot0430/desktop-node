import {
  FavoriteStarFill,
  FavoriteStarLine,
  CopyLine,
  DeleteTrashXlLine,
  CheckSuccessLine,
  Icon,
  CurrencyMoneyLine,
} from '@_koii/koii-styleguide';
import React, { memo, useState } from 'react';

import DotsSvg from 'assets/svgs/dots.svg';
import {
  LoadingSpinner,
  LoadingSpinnerSize,
  ErrorMessage,
  Button,
  Tooltip,
  TableRow,
  ColumnsLayout,
} from 'renderer/components/ui';
import { useFundNewAccountModal, useClipboard } from 'renderer/features/common';
import { useConfirmModal } from 'renderer/features/common/modals/ConfirmationModal';
import { getKoiiFromRoe } from 'utils';

import { useAccount, useAccountBalance } from '../../hooks';

type PropsType = {
  accountName: string;
  stakingPublicKey: string;
  mainPublicKey: string;
  isDefault: boolean;
  columnsLayout: ColumnsLayout;
};

export const AccountItem = memo(
  ({
    accountName,
    mainPublicKey,
    stakingPublicKey,
    isDefault,
    columnsLayout,
  }: PropsType) => {
    const [isDeleting, setIsDeleting] = useState(false);

    const { accountBalance = 0, accountBalanceLoadingError } =
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
    } = useAccount({ accountName, isDefault });

    const { showModal } = useConfirmModal({
      title: 'Delete Account',
      content: (
        <div className="flex justify-center px-4 py-6">
          <div className="">
            <p>
              Are you sure you want to delete{' '}
              <span className="text-lg text-green-dark">{accountName}</span>?
            </p>
            <br />
            This will erase all account information from the Node but <br />{' '}
            you’ll still be able to import it if you have a secret phrase
          </div>
        </div>
      ),
    });

    const { showModal: showFundModal } = useFundNewAccountModal({
      accountPublicKey: mainPublicKey,
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
    const StarIcon = isDefault ? FavoriteStarFill : FavoriteStarLine;
    const accountBalanceInKoii = getKoiiFromRoe(accountBalance);

    return (
      <div className="w-full mb-4 pr-2 text-white">
        <div className="pb-2 pl-[7%] text-xl font-semibold">{accountName}</div>
        {error && <ErrorMessage error={error} />}

        <TableRow columnsLayout={columnsLayout} className={rowClasses}>
          <div className="flex flex-col items-center justify-center row-span-2 py-1">
            <DotsSvg height={48} width={11} />
          </div>
          {setAccountActiveLoading ? (
            <LoadingSpinner />
          ) : (
            <Tooltip tooltipContent="Select as active account">
              <Button
                onClick={setAccountActive}
                icon={
                  <Icon
                    source={StarIcon}
                    className="text-finnieTeal-100 h-5 w-5"
                  />
                }
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
            <Tooltip tooltipContent={copiedMainKey ? 'Copied' : 'Copy'}>
              <Button
                onClick={handleCopyMainPublicKey}
                icon={
                  <Icon
                    source={copiedMainKey ? CheckSuccessLine : CopyLine}
                    className="text-black h-4 w-4"
                  />
                }
                className="rounded-full w-6.5 h-6.5 bg-finnieTeal-100"
              />
            </Tooltip>
            {/* <Button
            icon={<KeyIconSvg className="w-3.5 h-3.5" />}
            className="invisible w-6 h-6 rounded-full bg-finnieEmerald-light"
          /> */}
          </div>

          <span>
            {accountBalanceLoadingError ? '-' : accountBalanceInKoii} KOII
          </span>

          <div>
            {accountBalanceInKoii < 1 && (
              <Tooltip placement="top-left" tooltipContent="Add Funds">
                <Button
                  onClick={showFundModal}
                  onlyIcon
                  icon={
                    <Icon
                      source={CurrencyMoneyLine}
                      className="-mr-0.5 w-5 h-5 text-black"
                    />
                  }
                  className="rounded-full w-6.5 h-6.5 bg-finnieTeal-100"
                />
              </Tooltip>
            )}
          </div>

          <div className="mr-4 ml-auto">
            {!isDefault &&
              (isDeleting ? (
                <LoadingSpinner size={LoadingSpinnerSize.Medium} />
              ) : (
                <Tooltip placement="top-left" tooltipContent="Delete account">
                  <Button
                    disabled={isDeleting}
                    onClick={handleDeleteAccount}
                    icon={
                      <Icon
                        source={DeleteTrashXlLine}
                        className="w-5 h-5 text-black"
                      />
                    }
                    className="w-6.5 h-6.5 rounded-full bg-finnieRed mr-0"
                  />
                </Tooltip>
              ))}
          </div>
          <div />
          <div className="text-finnieOrange">Staking Key</div>

          {/* <Button
          icon={<EditIconSvg />}
          className="invisible w-6 h-6 rounded-full bg-finnieTeal-100"
        /> */}
          <div
            className="overflow-hidden text-ellipsis"
            title={stakingPublicKey}
          >
            {stakingPublicKey}
          </div>
          <div className="flex justify-center gap-4">
            <Tooltip tooltipContent={copiedStakingKey ? 'Copied' : 'Copy'}>
              <Button
                onClick={handleCopyStakingPublicKey}
                icon={
                  <Icon
                    source={copiedStakingKey ? CheckSuccessLine : CopyLine}
                    className="text-black h-4 w-4"
                  />
                }
                className="rounded-full w-6.5 h-6.5 bg-finnieTeal-100"
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
  }
);

AccountItem.displayName = 'AccountItem';
