import React, { memo } from 'react';
import { useQuery } from 'react-query';
import { useDispatch } from 'react-redux';

import AddIconSvg from 'assets/svgs/add-icon-outlined.svg';
import { Button } from 'webapp/components/ui/Button';
import { ErrorMessage } from 'webapp/components/ui/ErrorMessage';
import { getAllAccounts } from 'webapp/services';
import { showModal } from 'webapp/store/actions/modal';

import AccounInfo from './AccounInfo';

const KeyManagement = () => {
  const dispatch = useDispatch();

  const fetchAccounts = async () => {
    return await getAllAccounts();
  };

  const {
    data: accounts,
    isError,
    isLoading,
    error,
  } = useQuery(['accounts'], fetchAccounts);

  return (
    <div className="flex flex-col justify-between">
      <div>
        <div className="flex justify-between pb-4 mb-4 font-semibold leading-5 text-white border-b-2 border-white">
          <div className="w-[220px] pl-12">Account</div>
          <div className="w-[540px]">Adress</div>
          <div className="w-[136px]">Koii Balance</div>
        </div>
        <div className="h-[38vh] overflow-y-auto">
          {isLoading && (
            <div className="flex items-center justify-center h-full text-2xl text-white">
              Loading accounts...
            </div>
          )}
          {isError && (
            <div className="flex items-center justify-center text-2xl">
              <ErrorMessage
                errorMessage={(error as { message: string }).message}
              />
            </div>
          )}
          {(accounts ?? []).map(
            ({
              accountName,
              mainPublicKey,
              stakingPublicKey,
              isDefault,
              stakingPublicKeyBalance,
            }) => {
              return (
                <AccounInfo
                  stakingPublicKeyBalance={stakingPublicKeyBalance}
                  key={mainPublicKey}
                  mainPublicKey={mainPublicKey}
                  accountName={accountName}
                  stakingPublicKey={stakingPublicKey}
                  isDefault={isDefault}
                />
              );
            }
          )}
        </div>

        <Button
          label="New"
          className="w-auto p-2 mt-10 bg-transparent h-[60px] text-white"
          icon={<AddIconSvg />}
          onClick={() => dispatch(showModal('ADD_NEW_KEY'))}
        />
      </div>

      <div className="text-xs text-finnieOrange">
        Controlling access to your keys is critical to protecting your assets
        stored on the Blockchain.
      </div>
    </div>
  );
};

export default memo(KeyManagement);
