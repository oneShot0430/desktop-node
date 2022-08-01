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
  } = useQuery(['accounts'], fetchAccounts);

  if (isLoading) {
    return <div>Loading...</div>;
  }

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
            <div className="items-center justify-center felx">Loading...</div>
          )}
          {isError && (
            <div className="items-center justify-center felx">
              <ErrorMessage errorMessage={'Something went wrong'} />
            </div>
          )}
          {(accounts ?? []).map(
            ({ accountName, mainPublicKey, stakingPublicKey, isDefault }) => {
              return (
                <AccounInfo
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
          className="w-auto p-2 mt-10 bg-transparent h-[60px]"
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
