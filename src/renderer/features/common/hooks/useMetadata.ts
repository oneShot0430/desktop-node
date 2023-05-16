import { useQuery } from 'react-query';

import { getTaskMetadata, QueryKeys } from 'renderer/services';

export const useMetadata = (metadataCID: string) => {
  const {
    data: metadata,
    isLoading: isLoadingMetadata,
    error: metadataError,
  } = useQuery(
    [QueryKeys.TaskMetadata, metadataCID],
    () => getTaskMetadata(metadataCID),
    {
      staleTime: Infinity,
    }
  );
  return { metadata, isLoadingMetadata, metadataError };
};
