import { randomUUID } from 'crypto';

import { namespaceInstance } from '../../../main/node/helpers/Namespace';

import { PersistentStoreKeys } from '../types';

import { getStoredTaskVariables } from './getStoredTaskVariables';
import { storeTaskVariable } from './storeTaskVariable';

jest.mock('main/node/helpers/Namespace', () => {
  return {
    namespaceInstance: {
      storeSet: jest.fn(),
    },
  };
});

jest.mock('./getStoredTaskVariables', () => {
  return {
    getStoredTaskVariables: jest.fn(),
  };
});

jest.mock('crypto', () => {
  return {
    randomUUID: jest.fn(),
  };
});

describe('storeTaskVariable', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('throws an error if the payload is not valid', async () => {
    (getStoredTaskVariables as jest.Mock).mockResolvedValue({});

    const invalidPayload = {};

    await expect(
      storeTaskVariable(null, invalidPayload as unknown as never)
    ).rejects.toThrowError();
  });

  it('throws an error if the label already exists', async () => {
    (getStoredTaskVariables as jest.Mock).mockResolvedValue({
      'some-id': { label: 'existing label', value: 'some value' },
    });

    const existingLabelPayload = {
      label: 'existing label',
      value: 'some value',
    };

    await expect(
      storeTaskVariable(null, existingLabelPayload)
    ).rejects.toThrowError();
  });

  it('stores the task variable if the payload is valid and the label does not exist', async () => {
    const MOCKED_ID = 'some-id';

    (getStoredTaskVariables as jest.Mock).mockResolvedValue({
      'already-existing-id': {
        label: 'existing label',
        value: 'some existing value',
      },
    });

    (randomUUID as jest.Mock).mockReturnValue(MOCKED_ID);

    const validPayload = { label: 'new label', value: 'some new value' };

    await expect(
      storeTaskVariable(null, validPayload)
    ).resolves.not.toThrowError();

    expect(namespaceInstance.storeSet).toHaveBeenCalledWith(
      PersistentStoreKeys.TaskVariables,
      '{"already-existing-id":{"label":"existing label","value":"some existing value"},"some-id":{"label":"new label","value":"some new value"}}'
    );
  });
});
