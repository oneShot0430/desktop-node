import { PairTaskVariableParamType } from 'models';
import sdk from 'services/sdk';

import { namespaceInstance } from '../../node/helpers/Namespace';
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

jest.mock('services/sdk', () => {
  return {
    k2Connection: {
      getAccountInfo: jest.fn(),
    },
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

  it('throws an error if no Task on K2', async () => {
    (sdk.k2Connection.getAccountInfo as jest.Mock).mockResolvedValue(undefined);

    const validPayload: PairTaskVariableParamType = {
      taskAccountPubKey: k2PublicKeyExample,
      variableInTaskName: 'test',
      desktopVariableId: 'test1',
    };

    await expect(pairTaskVariable(null, validPayload)).rejects.toThrowError(
      /task not found/i
    );
  });

  it('throws an error if there is Task on K2 but with invalid data', async () => {
    (sdk.k2Connection.getAccountInfo as jest.Mock).mockResolvedValue({
      data: { toString: () => 'not parsable string' },
    });

    const validPayload: PairTaskVariableParamType = {
      taskAccountPubKey: k2PublicKeyExample,
      variableInTaskName: 'test',
      desktopVariableId: 'test1',
    };

    await expect(pairTaskVariable(null, validPayload)).rejects.toThrowError(
      /task not found/i
    );
  });

  it('throws an error if there is Task on K2 but not using given variable', async () => {
    (sdk.k2Connection.getAccountInfo as jest.Mock).mockResolvedValue({
      data: { toString: () => '{}' },
    });

    const notUsedVariableName = 'variableName';

    (getTaskVariablesNames as jest.Mock).mockResolvedValue(['otherName']);

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
    (sdk.k2Connection.getAccountInfo as jest.Mock).mockResolvedValue({
      data: { toString: () => '{}' },
    });

    const usedVariablename = 'variableName';

    (getTaskVariablesNames as jest.Mock).mockResolvedValue([usedVariablename]);

    (getStoredTaskVariables as jest.Mock).mockResolvedValue({
      otherId: { label: 'label', value: 'value' },
    });

    const validPayload: PairTaskVariableParamType = {
      taskAccountPubKey: k2PublicKeyExample,
      variableInTaskName: usedVariablename,
      desktopVariableId: 'test1',
    };

    await expect(pairTaskVariable(null, validPayload)).rejects.toThrowError(
      /desktop variable ID in the task not found/i
    );
  });

  it('pairs the task variable if the payload is valid - first pairing of the given task', async () => {
    (sdk.k2Connection.getAccountInfo as jest.Mock).mockResolvedValue({
      data: { toString: () => '{}' },
    });

    const usedVariableName = 'variableName';

    (getTaskVariablesNames as jest.Mock).mockResolvedValue([usedVariableName]);

    const usedStoredVariableId = 'someId';
    (getStoredTaskVariables as jest.Mock).mockResolvedValue({
      [usedStoredVariableId]: { label: 'label', value: 'value' },
    });

    (getStoredPairedTaskVariables as jest.Mock).mockResolvedValue({});

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

  it('pairs the task variable if the payload is valid - not first pairing of the given task', async () => {
    (sdk.k2Connection.getAccountInfo as jest.Mock).mockResolvedValue({
      data: { toString: () => '{}' },
    });

    const usedVariableName = 'variableName';

    (getTaskVariablesNames as jest.Mock).mockResolvedValue([usedVariableName]);

    const usedStoredVariableId = 'someId';
    (getStoredTaskVariables as jest.Mock).mockResolvedValue({
      [usedStoredVariableId]: { label: 'label', value: 'value' },
    });

    (getStoredPairedTaskVariables as jest.Mock).mockResolvedValue({
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
