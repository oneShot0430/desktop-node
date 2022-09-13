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
  stakingPublicKeyBalance,
}: PropsType) => {
  const { accountBalance, acountBalanceLoadingError } =
    useAccountBalance(stakingPublicKey);
  const { copyToClipboard, copied } = useClipboard();
  const {
    deleteAccount,
    setAccountActive,
    removingAccountError,
    setAccountActiveError,
  } = useAccount(accountName);

  const copyToClipboardHandler = () => {
    copyToClipboard(stakingPublicKey);
  };

  const error =
    (removingAccountError as string) || (setAccountActiveError as string);

  return (
    <div className="w-full mb-4 text-white">
      <div className="pb-2 pl-12 text-xl font-semibold">{accountName}</div>
      {error && <ErrorMessage errorMessage={error} />}
      <div className="flex flex-row p-4 rounded bg-finnieTeal-100 bg-opacity-5">
        <div className="flex flex-col items-center justify-center pr-4">
          <DotsSvg />
        </div>
        <div className="flex flex-col flex-grow gap-4">
          <div className="flex flex-row justify-between">
            <div className="flex flex-row w-[174px]">
              <Button
                onClick={setAccountActive}
                icon={isDefault ? <Star /> : <StarOutlined />}
                className="rounded-[50%] w-[24px] h-[24px] bg-transparent"
              />
              <span className="px-4">System Key</span>
              <Button
                icon={<EditIconSvg />}
                className="rounded-[50%] w-[24px] h-[24px] bg-finnieTeal-100"
              />
            </div>
            <div className="flex items-center gap-4 w-[520px]">
              <span
                className="max-w-[360px] text-ellipsis overflow-x-clip"
                title={mainPublicKey}
              >
                {mainPublicKey}
              </span>
              <Button
                tooltip="Copy"
                onClick={copyToClipboardHandler}
                icon={<CopyIconSvg />}
                /**
                 * @todo implement better copy action ux
                 */
                className={`rounded-[50%] w-[24px] h-[24px] ${
                  copied ? 'bg-finnieEmerald' : 'bg-finnieTeal-100'
                }`}
              />
              <Button
                icon={<KeyIconSvg className="w-[14px] h-[14px]" />}
                className="rounded-[50%] w-[24px] h-[24px] bg-finnieEmerald-light"
              />
            </div>
            <div className="flex flex-row items-center">
              <span className="px-4">
                {acountBalanceLoadingError ? '-' : accountBalance} KOII
              </span>
              <Button
                onClick={deleteAccount}
                icon={<DeleteIconSvg />}
                className="rounded-[50%] w-[24px] h-[24px] bg-finnieRed"
              />
            </div>
          </div>

          <div className="flex flex-row justify-between">
            <div className="px-[40px] w-[174px]">Staking Key</div>
            <div className="w-[520px]">
              <div
                className="w-[360px] text-ellipsis overflow-x-clip"
                title={stakingPublicKey}
              >
                {stakingPublicKey}
              </div>
            </div>
            <div className="pr-[24px]">
              <span className="px-4">{stakingPublicKeyBalance ?? 0} KOII</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default memo(AccountInfo);
