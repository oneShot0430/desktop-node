import {
  FavoriteStarFill,
  FavoriteStarLine,
  DeleteTrashXlLine,
  KeyUnlockLine,
  Icon,
  LockLine,
} from '@_koii/koii-styleguide';
import React, { memo, useState } from 'react';

import { FundButton } from 'renderer/components/FundButton';
import { TransferButton } from 'renderer/components/TransferButton';
import {
  LoadingSpinner,
  LoadingSpinnerSize,
  ErrorMessage,
  Button,
  Tooltip,
  TableRow,
  ColumnsLayout,
  CopyButton,
} from 'renderer/components/ui';
import { useClipboard, useDeleteAccountModal } from 'renderer/features/common';
import { useExportSecretPhrase } from 'renderer/features/common/hooks/useExportSecretPhrase';
import { Address } from 'renderer/features/tasks/components/AvailableTaskRow/components/Address';
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

    const stakingAccountBalanceInKoii = getKoiiFromRoe(stakingAccountBalance);

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

    return (
      <div className="w-full pr-2 mb-4 text-white">
        <div className="pb-2 pl-[5.5%] text-md font-semibold">
          {accountName}
        </div>
        {error && <ErrorMessage error={error} />}

        <TableRow columnsLayout={columnsLayout} className={rowClasses}>
          <div className="flex flex-col items-center justify-center row-span-2 py-1" />
          {setAccountActiveLoading ? (
            <LoadingSpinner />
          ) : (
            <Tooltip tooltipContent="Select as active account">
              <Button
                onClick={setAccountActive}
                icon={
                  <Icon
                    source={StarIcon}
                    className="w-5 h-5 text-finnieTeal-100"
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
          <Address
            address={mainPublicKey}
            className="pr-2 overflow-hidden text-ellipsis"
          />
          <div className="flex justify-center gap-4">
            <CopyButton
              onCopy={handleCopyMainPublicKey}
              isCopied={copiedMainKey}
              className="w-6.5 h-6.5"
            />
            <Tooltip placement="top-left" tooltipContent="Export Secret Phrase">
              <Button
                icon={<KeyUnlockLine className="w-3.5 h-3.5 text-white" />}
                className="w-6 h-6 bg-transparent rounded-full "
                onClick={handleExportSecretPhrase}
              />
            </Tooltip>
          </div>

          <span className="flex gap-2.5 items-center ml-3">
            <span>
              {accountBalanceLoadingError ? '-' : accountBalanceInKoii} KOII
            </span>
            {accountBalanceInKoii < 1 && (
              <span>
                <FundButton accountPublicKey={mainPublicKey} />
              </span>
            )}
            <span>
              <TransferButton
                accountPublicKey={mainPublicKey}
                accountName={accountName}
                accountType="SYSTEM"
              />
            </span>
          </span>

          <span />

          <div className="ml-auto mr-4">
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
          <Address
            address={stakingPublicKey}
            className="pr-2 overflow-hidden text-ellipsis"
          />
          <div className="flex justify-center gap-4">
            <CopyButton
              onCopy={handleCopyStakingPublicKey}
              isCopied={copiedStakingKey}
              className="w-6.5 h-6.5"
            />
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
              <Icon source={LockLine} className="w-4 h-4 mb-1 text-white" />
            </Tooltip>
            <span>
              <TransferButton
                accountPublicKey={stakingPublicKey}
                accountName={accountName}
                accountType="STAKING"
              />
            </span>
          </span>
        </TableRow>
      </div>
    );
  }
);

AccountItem.displayName = 'AccountItem';
