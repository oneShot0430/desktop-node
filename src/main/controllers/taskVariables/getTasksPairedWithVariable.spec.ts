import {
  GetStoredPairedTaskVariablesReturnType,
  GetTasksPairedWithVariableParamType,
} from 'models';

import { getTasksById } from '..';

import { getStoredPairedTaskVariables } from './getStoredPairedTaskVariables';
import { getTasksPairedWithVariable } from './getTasksPairedWithVariable';

jest.mock('./getStoredPairedTaskVariables', () => {
  return {
    getStoredPairedTaskVariables: jest.fn(),
  };
});

jest.mock('..', () => {
  return {
    getTasksById: jest.fn(),
  };
});

const getStoredPairedTaskVariablesMock =
  getStoredPairedTaskVariables as jest.Mock<
    Promise<GetStoredPairedTaskVariablesReturnType>
  >;

describe('getTasksPairedWithVariable', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('throws an error if the payload is not valid', async () => {
    const invalidPayload = {};

    await expect(
      getTasksPairedWithVariable(
        null,
        invalidPayload as GetTasksPairedWithVariableParamType
      )
    ).rejects.toThrowError(/payload is not valid/);
  });

  it("should return empty array if none of the Tasks is using given variable by it's ID", async () => {
    const taskId = 'id1';

    getStoredPairedTaskVariablesMock.mockResolvedValue({
      [taskId]: { name: 'varId' },
    });

    await expect(
      getTasksPairedWithVariable(null, { variableId: 'anotherVarId' })
    ).resolves.not.toThrowError();

    expect(getTasksById).toHaveBeenCalledWith(null, { tasksIds: [] });
  });

  it("should return Task using given variable by it's ID", async () => {
    const taskId = 'id1';
    const varId = 'variableId';

    getStoredPairedTaskVariablesMock.mockResolvedValue({
      [taskId]: { name: varId },
    });

    await expect(
      getTasksPairedWithVariable(null, { variableId: varId })
    ).resolves.not.toThrowError();

    expect(getTasksById).toHaveBeenCalledWith(null, { tasksIds: [taskId] });
  });
});
