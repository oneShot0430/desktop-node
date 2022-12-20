import { namespaceInstance } from 'main/node/helpers/Namespace';

import { getTaskVariables } from './getTaskVariables';

jest.mock('main/node/helpers/Namespace', () => {
  return {
    namespaceInstance: {
      storeGet: jest.fn(),
    },
  };
});

describe('getTaskVariables', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });
  it('should return an empty object if the task variables are not set', async () => {
    const result = await getTaskVariables();

    expect(result).toEqual({});
  });

  it('should return the task variables if they are set', async () => {
    (namespaceInstance.storeGet as jest.Mock).mockReturnValueOnce(
      '{"foo": "bar"}'
    );

    const result = await getTaskVariables();

    expect(result).toEqual({ foo: 'bar' });
  });

  it('should return an empty object if the task variables are invalid', async () => {
    (namespaceInstance.storeGet as jest.Mock).mockReturnValueOnce(
      '{"foo": "bar"'
    );

    const result = await getTaskVariables();

    expect(result).toEqual({});
  });
});
