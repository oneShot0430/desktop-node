import {
  FavoriteStarFill,
  FavoriteStarLine,
  CopyLine,
  DeleteTrashXlLine,
  CheckSuccessLine,
  KeyUnlockLine,
  Icon,
  LockLine,
} from '@_koii/koii-styleguide';
import React, { memo, useState } from 'react';

import DotsSvg from 'assets/svgs/dots.svg';
import { FundButton } from 'renderer/components/FundButton';
import {
  LoadingSpinner,
  LoadingSpinnerSize,
  ErrorMessage,
  Button,
  Tooltip,
  TableRow,
  ColumnsLayout,
} from 'renderer/components/ui';
import { useClipboard, useDeleteAccountModal } from 'renderer/features/common';
import { useExportSecretPhrase } from 'renderer/features/common/hooks/useExportSecretPhrase';
import { Theme } from 'renderer/types/common';
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

    const {
      accountBalance: stakingAccountBalance = 0,
      accountBalanceLoadingError: stakingAccountBalanceLoadingError,
    } = useAccountBalance(stakingPublicKey);

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

    const { showModal: showConfirmModal } = useDeleteAccountModal({
      accountName,
    });

    const { showModal: showExportSecretPhraseModal } = useExportSecretPhrase({
      accountName,
      publicKey: mainPublicKey,
    });

    const handleExportSecretPhrase = async () => {
      showExportSecretPhraseModal();
    };

    const handleDeleteAccount = async () => {
      const isConfirmed = await showConfirmModal();
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
    } bg-opacity-5 grid grid-cols-accounts gap-y-6 !py-4 border-none`;
    const StarIcon = isDefault ? FavoriteStarFill : FavoriteStarLine;
    const accountBalanceInKoii = getKoiiFromRoe(accountBalance);
    const stakingAccountBalanceInKoii = getKoiiFromRoe(stakingAccountBalance);

    return (
      <div className="w-full mb-4 pr-2 text-white">
        <div className="pb-2 pl-[5.5%] text-xl font-semibold">
          {accountName}
        </div>
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
                    className="h-4 w-4 text-white"
                  />
                }
                className="rounded-full w-6.5 h-6.5 bg-transparent outline-none"
              />
            </Tooltip>
            <Button
              icon={<KeyUnlockLine className="w-3.5 h-3.5 text-white" />}
              className=" w-6 h-6 rounded-full bg-transparent"
              onClick={handleExportSecretPhrase}
            />
          </div>

          <span className="flex gap-2.5 items-center ml-3">
            <span>
              {accountBalanceLoadingError ? '-' : accountBalanceInKoii} KOII
            </span>

            <span>
              {accountBalanceInKoii < 1 && (
                <FundButton accountPublicKey={mainPublicKey} />
              )}
            </span>
          </span>

          <span />

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
                        className="w-5 h-5 text-finnieRed"
                      />
                    }
                    className="w-6.5 h-6.5 rounded-full bg-transparent outline-none mr-0"
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
                    className="text-black h-4 w-4 text-white"
                  />
                }
                className="rounded-full w-6.5 h-6.5 bg-transparent outline-none"
              />
            </Tooltip>

            <div className="w-6" />
          </div>

          <span className="flex gap-2.5 items-center ml-3">
            <span>
              {stakingAccountBalanceLoadingError
                ? '-'
                : stakingAccountBalanceInKoii}{' '}
              KOII
            </span>

            <Tooltip
              theme={Theme.Light}
              placement="top-left"
              tooltipContent={
                <p className="w-[292px]">
                  This balance covers network fees. The key may be blocked from
                  the network if balance gets too low
                </p>
              }
            >
              <Icon source={LockLine} className="h-4 w-4 text-white mb-1" />
            </Tooltip>
          </span>
        </TableRow>
      </div>
    );
  }
);

AccountItem.displayName = 'AccountItem';
