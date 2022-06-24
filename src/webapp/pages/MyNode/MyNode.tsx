import React from 'react';
// import { useDispatch } from 'react-redux';

// import { showModal } from 'webapp/store/actions/modal';

import MyNodeTasksTable from './components/MyNodeTasksTable';
// import MyNodeToolbar from './components/MyNodeToolbar';

const MyNode = (): JSX.Element => {
  // const tableHeaders = [
  //   'Start/Stop',
  //   'TaskName & Start Time',
  //   'Role',
  //   'Creator',
  //   'Earned',
  //   'Stake',
  //   'Status',
  //   'Add/Withdraw',
  // ];
  // const dispatch = useDispatch();

  return (
    <div className="relative overflow-x-auto">
      {/*<table className="w-full text-[14px] text-left table-auto">*/}
      {/*  <thead className="pb-8 font-semibold">*/}
      {/*    <tr className="border-b-2">*/}
      {/*      {tableHeaders.map((headerText) => (*/}
      {/*        <th*/}
      {/*          key={headerText}*/}
      {/*          className="font-semibold leading-5 text-white racking-[0.03em] pb-4"*/}
      {/*        >*/}
      {/*          {headerText}*/}
      {/*        </th>*/}
      {/*      ))}*/}
      {/*    </tr>*/}
      {/*  </thead>*/}
      {/*</table>*/}
      <div>
        <MyNodeTasksTable />
      </div>
    </div>
  );
};

export default MyNode;
