import React, { useEffect } from 'react';
import InfiniteScroll from 'react-infinite-scroll-component';
import { twMerge } from 'tailwind-merge';

import { TableHeader } from './TableHeader';

interface PropsType {
  tableHeaders: string[];
  children: React.ReactNode[];
  update: () => void;
  hasMore: boolean;
  isLoading?: boolean;
  error?: string;
  height?: string;
}

export const InfiniteScrollTable = ({
  children,
  tableHeaders,
  update,
  hasMore,
  isLoading,
  error,
  height,
}: PropsType) => {
  const tableWrapperId = 'infiniteTableWrapper';
  const tableClasses = twMerge(
    'h-[74vh] overflow-y-auto overflow-x-auto',
    height && `h-[${height}]`
  );

  useEffect(() => {
    const root = document.getElementById(tableWrapperId);
    if (!isLoading && hasMore && root.scrollHeight <= root.clientHeight) {
      update();
    }
  }, [isLoading, hasMore]);

  if (isLoading) return <div>Loading...</div>;

  if (error) return <div>{error}</div>;

  return (
    <div className={tableClasses} id={tableWrapperId}>
      <InfiniteScroll
        dataLength={children.length}
        next={update}
        hasMore={hasMore}
        loader={<h4>Loading...</h4>}
        scrollableTarget={tableWrapperId}
      >
        <table className="w-full text-[14px] text-left table-auto">
          <TableHeader tableHeaders={tableHeaders} />
          <tbody>{children}</tbody>
        </table>
      </InfiniteScroll>
    </div>
  );
};
