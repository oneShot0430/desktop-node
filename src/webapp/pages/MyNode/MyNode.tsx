import React from 'react';
import { useDispatch } from 'react-redux';

import { showModal } from 'webapp/store/actions/modal';

import MyNodeTasksTable from './components/MyNodeTasksTable';
import MyNodeToolbar from './components/MyNodeToolbar';

const MyNode = (): JSX.Element => {
  const tableHeaders = [
    'Start/Stop',
    'TaskName & Start Time',
    'Role',
    'Creator',
    'Earned',
    'Stake',
    'Status',
    'Add/Withdraw',
  ];
  const dispatch = useDispatch();

  return (
    <div className="relative overflow-x-auto">
      <table className="w-full text-[14px] text-left table-auto">
        <thead className="font-semibold h-[40px]">
          <tr className="border">
            {tableHeaders.map((headerText) => (
              <th
                key={headerText}
                className="font-semibold leading-5 text-white racking-[0.03em]"
              >
                {headerText}
              </th>
            ))}
            <button onClick={() => dispatch(showModal('EDIT_STAKE_AMOUNT'))}>
              Edit Stake Amount
            </button>
          </tr>
        </thead>
      </table>
      {/* <div className="mt-34.5">
        <MyNodeTasksTable />
      </div> */}
    </div>
  );
};

export default MyNode;
