import React, { useEffect, ReactNode, RefCallback } from 'react';
import { useInView } from 'react-intersection-observer';
import { twMerge } from 'tailwind-merge';

import { LoadingSpinner, LoadingSpinnerSize } from '../LoadingSpinner';

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
  items?: number;
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
  items,
}: PropsType) {
  const { ref: tableBottomRef, inView } = useInView({
    threshold: 0,
  });

  useEffect(() => {
    if (!isLoading && hasMore && inView && !isFetchingNextPage) {
      update();
    }
  }, [isLoading, hasMore, update, inView, isFetchingNextPage]);

  const showLoader = !!items && (hasMore || isFetchingNextPage);

  const loaderClasses = twMerge(
    'w-fit mx-auto scale-75',
    showLoader ? '' : 'hidden'
  );

  const innerWrapperClasses = twMerge('relative h-4 my-8');

  return (
    <Table headers={headers} columnsLayout={columnsLayout} error={error}>
      <div
        ref={animationRef}
        className="!overflow-hidden flex flex-col min-h-[440px]"
      >
        <div>{children}</div>
        <div ref={tableBottomRef} className={innerWrapperClasses}>
          <div className={loaderClasses}>
            <LoadingSpinner size={LoadingSpinnerSize.Large} />
          </div>
        </div>
      </div>
    </Table>
  );
}
