import { namespaceInstance } from 'main/node/helpers/Namespace';

import { PersistentStoreKeys } from '../types';

import { deleteTaskVariable } from './deleteTaskVariable';
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

const getStoredTaskVariablesMock = getStoredTaskVariables as jest.Mock;

describe('deleteTaskVariable', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('throws an error if the payload is not valid - undefined', async () => {
    getStoredTaskVariablesMock.mockResolvedValue({});

    let invalidPayload: undefined;

    await expect(
      deleteTaskVariable(null, invalidPayload)
    ).rejects.toThrowError();
  });

  it('throws an error if the payload is not valid - number', async () => {
    getStoredTaskVariablesMock.mockResolvedValue({});

    const invalidPayload = 123;

    await expect(
      deleteTaskVariable(null, invalidPayload as never)
    ).rejects.toThrowError();
  });

  it('throws an error if variable is not found by ID', async () => {
    getStoredTaskVariablesMock.mockResolvedValue({
      'some-id': { label: 'label', value: 'some value' },
    });

    const nonExistingIdPayload = 'some-other-id';

    await expect(
      deleteTaskVariable(null, nonExistingIdPayload)
    ).rejects.toThrowError();
  });

  it('deletes the task variable if the payload is valid and the ID does exist', async () => {
    const idForDeletion = 'already-existing-id';
    getStoredTaskVariablesMock.mockResolvedValue({
      [idForDeletion]: {
        label: 'label',
        value: 'some existing value',
      },
      'already-existing-id-2': {
        label: 'another-label',
        value: 'some another existing value',
      },
    });

    await expect(
      deleteTaskVariable(null, idForDeletion)
    ).resolves.not.toThrowError();

    expect(namespaceInstance.storeSet).toHaveBeenCalledWith(
      PersistentStoreKeys.TaskVariables,
      '{"already-existing-id-2":{"label":"another-label","value":"some another existing value"}}'
    );
  });
});
