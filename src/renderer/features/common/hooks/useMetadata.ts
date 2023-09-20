import { useQuery, UseQueryOptions } from 'react-query';

import { TaskMetadata } from 'models';
import { getTaskMetadata, QueryKeys } from 'renderer/services';

type CIDType = string | undefined | null;

const fetchMetadata = async (metadataCID: CIDType) => {
  if (!metadataCID) {
    return null;
  }

  const results = await getTaskMetadata(metadataCID);

  return results;
};

export const useMetadata = ({
  metadataCID,
  queryOptions,
}: {
  metadataCID: CIDType;
  queryOptions?: Omit<
    UseQueryOptions<
      TaskMetadata | null,
      unknown,
      TaskMetadata | null,
      (string | null | undefined)[]
    >,
    'queryKey' | 'queryFn'
  >;
}) => {
  const {
    data: metadata,
    isLoading: isLoadingMetadata,
    error: metadataError,
  } = useQuery(
    [QueryKeys.TaskMetadata, metadataCID],
    () => fetchMetadata(metadataCID),
    {
      staleTime: Infinity,
      retry: 10,
      ...queryOptions,
    }
  );
  return { metadata, isLoadingMetadata, metadataError };
};
