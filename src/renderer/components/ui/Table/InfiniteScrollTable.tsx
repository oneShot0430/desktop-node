import React, { useEffect, ReactNode } from 'react';
import InfiniteScroll from 'react-infinite-scroll-component';

import { LoadingSpinner } from '../LoadingSpinner';

import { Table } from './Table';
import { TableHeader, ColumnsLayout } from './TableHeaders';

interface PropsType {
  headers: TableHeader[];
  columnsLayout: ColumnsLayout;
  children: ReactNode[];
  update: () => void;
  hasMore: boolean;
  isLoading?: boolean;
  error?: Error | null;
}

const tableWrapperId = 'infiniteTableWrapper';

export function InfiniteScrollTable({
  headers,
  columnsLayout,
  children,
  update,
  hasMore,
  isLoading,
  error,
}: PropsType) {
  useEffect(() => {
    const root = document.getElementById(tableWrapperId)!;
    if (!isLoading && hasMore && root.scrollHeight <= root.clientHeight) {
      update();
    }
  }, [isLoading, hasMore, update]);

  return (
    <Table
      headers={headers}
      columnsLayout={columnsLayout}
      isLoading={isLoading}
      error={error}
    >
      <div id={tableWrapperId}>
        <InfiniteScroll
          className="!overflow-hidden min-h-table"
          dataLength={children.length}
          next={update}
          hasMore={hasMore}
          loader={<LoadingSpinner />}
          scrollableTarget={tableWrapperId}
        >
          {children}
        </InfiniteScroll>
      </div>
    </Table>
  );
}
