import { namespaceInstance } from 'main/node/helpers/Namespace';
import { EditTaskVariableParamType } from 'models';

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

describe('editTaskVariable', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('throws an error if the payload is not valid', async () => {
    (getStoredTaskVariables as jest.Mock).mockResolvedValue({});

    const invalidPayload = {};

    await expect(
      editTaskVariable(null, invalidPayload as never)
    ).rejects.toThrowError();
  });

  it('throws an error if variable is not found by id', async () => {
    (getStoredTaskVariables as jest.Mock).mockResolvedValue({
      'some-id': { label: 'label', value: 'some value' },
    });

    const nonExistingIdPayload: EditTaskVariableParamType = {
      variableId: 'some-other-id',
      variableData: {
        label: 'another label',
        value: 'some value',
      },
    };

    await expect(
      editTaskVariable(null, nonExistingIdPayload)
    ).rejects.toThrowError();
  });

  it('changes the task variable if the payload is valid and the ID does exist', async () => {
    (getStoredTaskVariables as jest.Mock).mockResolvedValue({
      'already-existing-id': {
        label: 'existing label',
        value: 'some existing value',
      },
    });

    const validPayload: EditTaskVariableParamType = {
      variableId: 'already-existing-id',
      variableData: { label: 'existing label', value: 'some new value' },
    };

    await expect(
      editTaskVariable(null, validPayload)
    ).resolves.not.toThrowError();

    expect(namespaceInstance.storeSet).toHaveBeenCalledWith(
      PersistentStoreKeys.TaskVariables,
      '{"already-existing-id":{"label":"existing label","value":"some new value"}}'
    );
  });
});
