import { SystemDbKeys } from 'config/systemDbKeys';
import { namespaceInstance } from 'main/node/helpers/Namespace';

const getActiveAccountName = async (): Promise<string> => {
  const activeAccount = await namespaceInstance.storeGet(
    SystemDbKeys.ActiveAccount
  );

  return activeAccount;
};

export default getActiveAccountName;
