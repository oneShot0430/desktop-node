import { useQuery } from 'react-query';

import { getTaskMetadata, QueryKeys } from 'renderer/services';

export const useMetadata = (metadataCID: string) => {
  const {
    data: metadata,
    isLoading: isLoadingMetadata,
    error: metadataError,
  } = useQuery([QueryKeys.TaskMetadata], () => getTaskMetadata(metadataCID));

  return { metadata, isLoadingMetadata, metadataError };
};
