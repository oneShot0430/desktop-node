import { namespaceInstance } from 'main/node/helpers/Namespace';
import { PairedTaskVariables } from 'models';

import { getStoredPairedTaskVariables } from './getStoredPairedTaskVariables';

jest.mock('main/node/helpers/Namespace', () => {
  return {
    namespaceInstance: {
      storeGet: jest.fn(),
    },
  };
});

const namespaceStoreGetMock = namespaceInstance.storeGet as jest.Mock;

describe('getStoredPairedTaskVariables', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });
  it('should return an empty object if the task variables pairs are not set', async () => {
    namespaceStoreGetMock.mockReturnValueOnce(undefined);

    const result = await getStoredPairedTaskVariables();

    expect(result).toEqual({});
  });

  it('should return the task variables pairs if they are set', async () => {
    const pairs: PairedTaskVariables = {
      'task-id': { variable: 'variable-id' },
    };
    namespaceStoreGetMock.mockReturnValueOnce(JSON.stringify(pairs));

    const result = await getStoredPairedTaskVariables();

    expect(result).toEqual(pairs);
  });

  it('should return an empty object if the task variables pairs are invalid', async () => {
    namespaceStoreGetMock.mockReturnValueOnce(
      '{"task-id":{"variable":"variable-id"'
    );

    const result = await getStoredPairedTaskVariables();

    expect(result).toEqual({});
  });
});
