import { OMITTED_VARIABLE_IDENTIFIER, PairTaskVariableParamType } from 'models';

import { namespaceInstance } from '../../node/helpers/Namespace';
import { validateTask } from '../getTaskInfo';
import { PersistentStoreKeys } from '../types';

import { getStoredPairedTaskVariables } from './getStoredPairedTaskVariables';
import { getStoredTaskVariables } from './getStoredTaskVariables';
import { getTaskVariablesNames } from './getTaskVariablesNames';
import { pairTaskVariable } from './pairTaskVariable';

jest.mock('main/node/helpers/Namespace', () => {
  return {
    namespaceInstance: {
      storeSet: jest.fn(),
    },
  };
});

jest.mock('../getTaskInfo', () => {
  return {
    validateTask: jest.fn(),
  };
});

jest.mock('./getStoredPairedTaskVariables', () => {
  return {
    getStoredPairedTaskVariables: jest.fn(),
  };
});

jest.mock('./getStoredTaskVariables', () => {
  return {
    getStoredTaskVariables: jest.fn(),
  };
});

jest.mock('./getTaskVariablesNames', () => {
  return {
    getTaskVariablesNames: jest.fn(),
  };
});

const validateTaskMock = validateTask as jest.Mock;
const getTaskVariableNamesMock = getTaskVariablesNames as jest.Mock;
const getStoredTaskVariablesMock = getStoredTaskVariables as jest.Mock;
const getStoredPairedTaskVariablesMock =
  getStoredPairedTaskVariables as jest.Mock;

const k2PublicKeyExample = '7Ds4GdPPGb2DNEwT6is31i1KkR2WqusttB55T4QgGUvg';

describe('pairTaskVariable', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('throws an error if the payload is not valid - all arguments missing', async () => {
    const invalidPayload = {};

    await expect(
      pairTaskVariable(null, invalidPayload as PairTaskVariableParamType)
    ).rejects.toThrowError(/payload is not valid/i);
  });

  it('throws an error if there is Task on K2 but not using given variable', async () => {
    validateTaskMock.mockResolvedValue({});

    const notUsedVariableName = 'variableName';

    getTaskVariableNamesMock.mockResolvedValue(['otherName']);

    const validPayload: PairTaskVariableParamType = {
      taskAccountPubKey: k2PublicKeyExample,
      variableInTaskName: notUsedVariableName,
      desktopVariableId: 'test1',
    };

    await expect(pairTaskVariable(null, validPayload)).rejects.toThrowError(
      /variable Name in the task not found/i
    );
  });

  it('throws an error if there is no variable stored with given ID', async () => {
    validateTaskMock.mockResolvedValue({});

    const usedVariableName = 'variableName';

    getTaskVariableNamesMock.mockResolvedValue([usedVariableName]);

    getStoredTaskVariablesMock.mockResolvedValue({
      otherId: { label: 'label', value: 'value' },
    });

    const validPayload: PairTaskVariableParamType = {
      taskAccountPubKey: k2PublicKeyExample,
      variableInTaskName: usedVariableName,
      desktopVariableId: 'test1',
    };

    await expect(pairTaskVariable(null, validPayload)).rejects.toThrowError(
      /desktop variable ID in the task not found/i
    );
  });

  it('pairs the task variable if the payload is valid - first pairing of the given task', async () => {
    validateTaskMock.mockResolvedValue({});

    const usedVariableName = 'variableName';

    getTaskVariableNamesMock.mockResolvedValue([usedVariableName]);

    const usedStoredVariableId = 'someId';
    getStoredTaskVariablesMock.mockResolvedValue({
      [usedStoredVariableId]: { label: 'label', value: 'value' },
    });

    getStoredPairedTaskVariablesMock.mockResolvedValue({});

    const validPayload: PairTaskVariableParamType = {
      taskAccountPubKey: k2PublicKeyExample,
      variableInTaskName: usedVariableName,
      desktopVariableId: usedStoredVariableId,
    };

    await expect(
      pairTaskVariable(null, validPayload)
    ).resolves.not.toThrowError();

    expect(namespaceInstance.storeSet).toHaveBeenCalledWith(
      PersistentStoreKeys.TaskToVariablesPairs,
      '{"7Ds4GdPPGb2DNEwT6is31i1KkR2WqusttB55T4QgGUvg":{"variableName":"someId"}}'
    );
  });

  it('pairs (marks) the task variable as omitted if the payload is valid', async () => {
    validateTaskMock.mockResolvedValue({});

    const usedVariableName = 'variableName';

    getTaskVariableNamesMock.mockResolvedValue([usedVariableName]);

    const usedStoredVariableId = 'someId';
    getStoredTaskVariablesMock.mockResolvedValue({
      [usedStoredVariableId]: { label: 'label', value: 'value' },
    });

    getStoredPairedTaskVariablesMock.mockResolvedValue({});

    const validPayload: PairTaskVariableParamType = {
      taskAccountPubKey: k2PublicKeyExample,
      variableInTaskName: usedVariableName,
      desktopVariableId: OMITTED_VARIABLE_IDENTIFIER,
    };

    await expect(
      pairTaskVariable(null, validPayload)
    ).resolves.not.toThrowError();

    expect(namespaceInstance.storeSet).toHaveBeenCalledWith(
      PersistentStoreKeys.TaskToVariablesPairs,
      `{"7Ds4GdPPGb2DNEwT6is31i1KkR2WqusttB55T4QgGUvg":{"variableName":"${OMITTED_VARIABLE_IDENTIFIER}"}}`
    );
  });

  it('pairs the task variable if the payload is valid - not first pairing of the given task', async () => {
    validateTaskMock.mockResolvedValue({});

    const usedVariableName = 'variableName';

    getTaskVariableNamesMock.mockResolvedValue([usedVariableName]);

    const usedStoredVariableId = 'someId';
    getStoredTaskVariablesMock.mockResolvedValue({
      [usedStoredVariableId]: { label: 'label', value: 'value' },
    });

    getStoredPairedTaskVariablesMock.mockResolvedValue({
      [k2PublicKeyExample]: { secretVar: 'anotherVariableId' },
    });

    const validPayload: PairTaskVariableParamType = {
      taskAccountPubKey: k2PublicKeyExample,
      variableInTaskName: usedVariableName,
      desktopVariableId: usedStoredVariableId,
    };

    await expect(
      pairTaskVariable(null, validPayload)
    ).resolves.not.toThrowError();

    expect(namespaceInstance.storeSet).toHaveBeenCalledWith(
      PersistentStoreKeys.TaskToVariablesPairs,
      '{"7Ds4GdPPGb2DNEwT6is31i1KkR2WqusttB55T4QgGUvg":{"secretVar":"anotherVariableId","variableName":"someId"}}'
    );
  });
});
