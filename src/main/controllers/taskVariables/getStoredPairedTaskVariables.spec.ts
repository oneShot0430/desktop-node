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

describe('getStoredPairedTaskVariables', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });
  it('should return an empty object if the task variables pairs are not set', async () => {
    (namespaceInstance.storeGet as jest.Mock).mockReturnValueOnce(undefined);

    const result = await getStoredPairedTaskVariables();

    expect(result).toEqual({});
  });

  it('should return the task variables pairs if they are set', async () => {
    const pairs: PairedTaskVariables = {
      'task-id': { variable: 'variable-id' },
    };
    (namespaceInstance.storeGet as jest.Mock).mockReturnValueOnce(
      JSON.stringify(pairs)
    );

    const result = await getStoredPairedTaskVariables();

    expect(result).toEqual(pairs);
  });

  it('should return an empty object if the task variables pairs are invalid', async () => {
    (namespaceInstance.storeGet as jest.Mock).mockReturnValueOnce(
      '{"task-id":{"variable":"variable-id"'
    );

    const result = await getStoredPairedTaskVariables();

    expect(result).toEqual({});
  });
});
