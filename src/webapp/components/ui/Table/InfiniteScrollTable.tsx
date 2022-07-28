import React from 'react';
import InfiniteScroll from 'react-infinite-scroll-component';

import { TableHeader } from './TableHeader';

interface PropsType {
  tableHeaders: string[];
  children: React.ReactNode[];
  update: () => void;
  hasMore: boolean;
  isLoading?: boolean;
  error?: string;
}

export const InfiniteScrollTable = ({
  children,
  tableHeaders,
  update,
  hasMore,
  isLoading,
  error,
}: PropsType) => {
  if (isLoading) return <div>Loading...</div>;

  if (error) return <div>{error}</div>;

  return (
    <div className="h-max-full">
      <InfiniteScroll
        dataLength={children.length}
        next={update}
        hasMore={hasMore}
        loader={<h4>Loading...</h4>}
      >
        <table className="w-full text-[14px] text-left table-auto">
          <TableHeader tableHeaders={tableHeaders} />
          <tbody>{children}</tbody>
        </table>
      </InfiniteScroll>
    </div>
  );
};
