import { namespaceInstance } from '../../node/helpers/Namespace';
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

describe('deleteTaskVariable', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('throws an error if the payload is not valid - undefined', async () => {
    (getStoredTaskVariables as jest.Mock).mockResolvedValue({});

    let invalidPayload: undefined;

    await expect(
      deleteTaskVariable({} as Event, invalidPayload)
    ).rejects.toThrow();
  });

  it('throws an error if the payload is not valid - number', async () => {
    (getStoredTaskVariables as jest.Mock).mockResolvedValue({});

    const invalidPayload = 123;

    await expect(
      deleteTaskVariable({} as Event, invalidPayload as never)
    ).rejects.toThrow();
  });

  it('throws an error if variable is not found by ID', async () => {
    (getStoredTaskVariables as jest.Mock).mockResolvedValue({
      'some-id': { label: 'label', value: 'some value' },
    });

    const nonExistingIdPayload = 'some-other-id';

    await expect(
      deleteTaskVariable({} as Event, nonExistingIdPayload)
    ).rejects.toThrow();
  });

  it('deletes the task variable if the payload is valid and the ID does exist', async () => {
    const idForDeletion = 'already-existing-id';
    (getStoredTaskVariables as jest.Mock).mockResolvedValue({
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
      deleteTaskVariable({} as Event, idForDeletion)
    ).resolves.not.toThrow();

    expect(namespaceInstance.storeSet).toHaveBeenCalledWith(
      PersistentStoreKeys.TaskVariables,
      '{"already-existing-id-2":{"label":"another-label","value":"some another existing value"}}'
    );
  });
});
