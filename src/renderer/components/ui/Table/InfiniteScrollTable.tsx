import React, { useEffect, ReactNode, RefCallback } from 'react';
import { useInView } from 'react-intersection-observer';

import { DotsLoader } from 'renderer/components/ui/DotsLoader';

import { Table } from './Table';
import { TableHeader, ColumnsLayout } from './TableHeaders';

interface PropsType {
  animationRef?: RefCallback<HTMLDivElement>;
  isFetchingNextPage: boolean;
  headers: TableHeader[];
  columnsLayout: ColumnsLayout;
  children: ReactNode[];
  update: () => void;
  hasMore: boolean;
  isLoading?: boolean;
  error?: Error | null;
}

export function InfiniteScrollTable({
  animationRef,
  isFetchingNextPage,
  headers,
  columnsLayout,
  children,
  update,
  hasMore,
  isLoading,
  error,
}: PropsType) {
  const { ref: tableBottomRef, inView } = useInView({
    threshold: 0,
  });

  useEffect(() => {
    if (!isLoading && hasMore && inView && !isFetchingNextPage) {
      update();
    }
  }, [isLoading, hasMore, update, inView, isFetchingNextPage]);

  return (
    <Table headers={headers} columnsLayout={columnsLayout} error={error}>
      <div
        ref={animationRef}
        className="!overflow-hidden min-h-[440px] flex flex-col"
      >
        <div className="">{children}</div>
        <div ref={tableBottomRef} className="h-4 my-8 relative">
          <div
            className={`${
              hasMore || isFetchingNextPage ? '' : 'hidden'
            } w-fit mx-auto scale-75`}
          >
            <DotsLoader />
          </div>
        </div>
      </div>
    </Table>
  );
}
