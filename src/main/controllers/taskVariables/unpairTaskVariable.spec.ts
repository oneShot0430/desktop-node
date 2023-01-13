import { UnpairTaskVariableParamType } from 'models';

import { namespaceInstance } from '../../node/helpers/Namespace';
import { PersistentStoreKeys } from '../types';

import { getStoredPairedTaskVariables } from './getStoredPairedTaskVariables';
import { unpairTaskVariable } from './unpairTaskVariable';

jest.mock('main/node/helpers/Namespace', () => {
  return {
    namespaceInstance: {
      storeSet: jest.fn(),
    },
  };
});

jest.mock('./getStoredPairedTaskVariables', () => {
  return {
    getStoredPairedTaskVariables: jest.fn(),
  };
});

const k2PublicKeyExample = '7Ds4GdPPGb2DNEwT6is31i1KkR2WqusttB55T4QgGUvg';

describe('unpairTaskVariable', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('throws an error if the payload is not valid', async () => {
    const invalidPayload = {};

    await expect(
      unpairTaskVariable(null, invalidPayload as UnpairTaskVariableParamType)
    ).rejects.toThrowError(/payload is not valid/);
  });

  it('throws an error if the payload is not valid - missing Task Id', async () => {
    const invalidPayload = { desktopVariableId: 'test' };

    await expect(
      unpairTaskVariable(null, invalidPayload as UnpairTaskVariableParamType)
    ).rejects.toThrowError(/payload is not valid/);
  });

  it('throws an error if there is no pairings for provided Task', async () => {
    (getStoredPairedTaskVariables as jest.Mock).mockResolvedValue({
      otherId: {},
    });

    const validPayload: UnpairTaskVariableParamType = {
      taskAccountPubKey: k2PublicKeyExample,
      desktopVariableId: 'test1',
    };

    await expect(unpairTaskVariable(null, validPayload)).rejects.toThrowError(
      /no pairings for Task/
    );
  });

  it('throws an error if there is Task on K2 but not using given variable', async () => {
    (getStoredPairedTaskVariables as jest.Mock).mockResolvedValue({
      [k2PublicKeyExample]: { name: 'other-task-variable-id' },
    });

    const validPayload: UnpairTaskVariableParamType = {
      taskAccountPubKey: k2PublicKeyExample,
      desktopVariableId: 'test1',
    };

    await expect(unpairTaskVariable(null, validPayload)).rejects.toThrowError(
      /no pairings for stored Task/
    );
  });

  it('unpairs the task variable if the payload is valid - unpair of more that one pairings', async () => {
    (getStoredPairedTaskVariables as jest.Mock).mockResolvedValue({
      [k2PublicKeyExample]: { name1: 'test1', name2: 'test2' },
    });

    const validPayload: UnpairTaskVariableParamType = {
      taskAccountPubKey: k2PublicKeyExample,
      desktopVariableId: 'test1',
    };

    await expect(
      unpairTaskVariable(null, validPayload)
    ).resolves.not.toThrowError();

    expect(namespaceInstance.storeSet).toHaveBeenCalledWith(
      PersistentStoreKeys.TaskToVariablesPairs,
      '{"7Ds4GdPPGb2DNEwT6is31i1KkR2WqusttB55T4QgGUvg":{"name2":"test2"}}'
    );
  });

  it('pairs the task variable if the payload is valid - unpair of single pairing', async () => {
    (getStoredPairedTaskVariables as jest.Mock).mockResolvedValue({
      [k2PublicKeyExample]: { name1: 'test1' },
    });

    const validPayload: UnpairTaskVariableParamType = {
      taskAccountPubKey: k2PublicKeyExample,
      desktopVariableId: 'test1',
    };

    await expect(
      unpairTaskVariable(null, validPayload)
    ).resolves.not.toThrowError();

    expect(namespaceInstance.storeSet).toHaveBeenCalledWith(
      PersistentStoreKeys.TaskToVariablesPairs,
      '{"7Ds4GdPPGb2DNEwT6is31i1KkR2WqusttB55T4QgGUvg":{}}'
    );
  });
});
