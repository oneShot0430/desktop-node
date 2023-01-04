import { namespaceInstance } from 'main/node/helpers/Namespace';

import { PersistentStoreKeys } from '../types';

import { editTaskVariable } from './editTaskVariable';
import { getStoredTaskVariables } from './getStoredTaskVariables';

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

describe('editTaskVariable', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('throws an error if the payload is not valid', async () => {
    (getStoredTaskVariables as jest.Mock).mockResolvedValue({});

    const invalidPayload = {};

    await expect(
      editTaskVariable(null, invalidPayload as unknown as never)
    ).rejects.toThrowError();
  });

  it('throws an error if variable is not found by label', async () => {
    (getStoredTaskVariables as jest.Mock).mockResolvedValue({
      'some-id': { label: 'label', value: 'some value' },
    });

    const nonExistingLabelPayload = {
      label: 'another label',
      value: 'some value',
    };

    await expect(
      editTaskVariable(null, nonExistingLabelPayload)
    ).rejects.toThrowError();
  });

  it('changes the task variable if the payload is valid and the label does exist', async () => {
    (getStoredTaskVariables as jest.Mock).mockResolvedValue({
      'already-existing-id': {
        label: 'existing label',
        value: 'some existing value',
      },
    });

    const validPayload = { label: 'existing label', value: 'some new value' };

    await expect(
      editTaskVariable(null, validPayload)
    ).resolves.not.toThrowError();

    expect(namespaceInstance.storeSet).toHaveBeenCalledWith(
      PersistentStoreKeys.TaskVariables,
      '{"already-existing-id":{"label":"existing label","value":"some new value"}}'
    );
  });
});
