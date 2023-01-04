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

describe('deleteTaskVariable', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('throws an error if the payload is not valid - undefined', async () => {
    (getStoredTaskVariables as jest.Mock).mockResolvedValue({});

    const invalidPayload: unknown = undefined;

    await expect(
      deleteTaskVariable(null, invalidPayload as unknown as never)
    ).rejects.toThrowError();
  });

  it('throws an error if the payload is not valid - number', async () => {
    (getStoredTaskVariables as jest.Mock).mockResolvedValue({});

    const invalidPayload = 123;

    await expect(
      deleteTaskVariable(null, invalidPayload as unknown as never)
    ).rejects.toThrowError();
  });

  it('throws an error if variable is not found by label', async () => {
    (getStoredTaskVariables as jest.Mock).mockResolvedValue({
      'some-id': { label: 'label', value: 'some value' },
    });

    const nonExistingLabelPayload = 'nope label';

    await expect(
      deleteTaskVariable(null, nonExistingLabelPayload)
    ).rejects.toThrowError();
  });

  it('deletes the task variable if the payload is valid and the label does exist', async () => {
    const labelForDeletion = 'existing-label';
    (getStoredTaskVariables as jest.Mock).mockResolvedValue({
      'already-existing-id': {
        label: labelForDeletion,
        value: 'some existing value',
      },
      'already-existing-id-2': {
        label: 'another-label',
        value: 'some another existing value',
      },
    });

    await expect(
      deleteTaskVariable(null, labelForDeletion)
    ).resolves.not.toThrowError();

    expect(namespaceInstance.storeSet).toHaveBeenCalledWith(
      PersistentStoreKeys.TaskVariables,
      '{"already-existing-id-2":{"label":"another-label","value":"some another existing value"}}'
    );
  });
});
