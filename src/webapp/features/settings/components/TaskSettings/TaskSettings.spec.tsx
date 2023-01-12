import { screen, within } from '@testing-library/react';
import user from '@testing-library/user-event';
import { cloneDeep } from 'lodash';
import React from 'react';

import {
  TaskVariableData,
  TaskVariables,
  TaskVariableDataWithId,
} from 'models/api';
import { render } from 'webapp/tests/utils';

import { TaskSettings } from './TaskSettings';

jest.mock('webapp/services', () => {
  const getStoredTaskVariablesInitialState: TaskVariables = {
    id: {
      label: 'my label',
      value: 'my key',
    },
    anotherId: {
      label: 'another label',
      value: 'another key',
    },
  };
  const getStoredTaskVariablesMock = jest
    .fn()
    .mockReturnValue(getStoredTaskVariablesInitialState);

  return {
    __esModule: true,
    ...jest.requireActual('webapp/services'),
    getStoredTaskVariables: getStoredTaskVariablesMock,
    storeTaskVariable: jest.fn((newTaskVariableData: TaskVariableData) => {
      getStoredTaskVariablesMock.mockReturnValueOnce({
        ...cloneDeep(getStoredTaskVariablesInitialState),
        newId: newTaskVariableData,
      });
    }),
    deleteTaskVariable: jest.fn((taskVariableId: string) => {
      const updatedVariablescopy = cloneDeep(
        getStoredTaskVariablesInitialState
      );
      delete updatedVariablescopy[taskVariableId];
      getStoredTaskVariablesMock.mockReturnValueOnce({
        ...updatedVariablescopy,
      });
    }),
    editTaskVariable: jest.fn(
      ({ id, label, value }: TaskVariableDataWithId) => {
        const updatedVariablescopy = {
          ...cloneDeep(getStoredTaskVariablesInitialState),
          [id]: { label, value },
        };
        getStoredTaskVariablesMock.mockReturnValueOnce({
          ...updatedVariablescopy,
        });
      }
    ),
  };
});

const inspectModalDescription =
  'This is placeholder for information about the tool, website, function, etc.';
const editModalDescription = 'Edit information about your Task Setting';
const deleteModalDescription = 'Are you sure you want to delete Task Setting';
const duplicatedLabelErrorMessage =
  'You already have a tool registered with that label';

const existingTaskVariablesData = [
  {
    label: 'my label',
    value: 'my key',
  },
  {
    label: 'another label',
    value: 'another key',
  },
];

const newTaskVariableData = {
  label: 'new label',
  value: 'new key',
};

describe('TaskSettings', () => {
  describe('Inspect task variable', () => {
    it('displays the right information for the selected variable', async () => {
      render(<TaskSettings />);

      for (const existingTaskVariableData of existingTaskVariablesData) {
        const variableItem = await screen.findByText(
          existingTaskVariableData.label
        );
        const inspectItemButton = within(
          variableItem.parentElement
        ).getByTestId(/inspect-task-variable/i);
        await user.click(inspectItemButton);

        const inspectModal = screen.getByText(inspectModalDescription)
          .parentElement.parentElement;
        const label = within(inspectModal).getByText(
          existingTaskVariableData.label
        );
        const key = within(inspectModal).getByText(
          existingTaskVariableData.value
        );

        expect(label).toBeInTheDocument();
        expect(key).toBeInTheDocument();
      }
    });
  });
  describe('Add task variable', () => {
    it('displays the proper error and disables the Add button if the label entered is not valid', async () => {
      render(<TaskSettings />);

      const variableLabelInput = screen.getByPlaceholderText(/Add Label/i);
      await user.type(variableLabelInput, 'my label');

      const labelError = await screen.findByText(duplicatedLabelErrorMessage);
      const addButton = screen.getByRole('button', { name: /Add/i });

      expect(labelError).toBeInTheDocument();
      expect(addButton).toBeDisabled();
    });

    it('disables the Add button if there is no label or key value entered, and enables it when both are there (and the label is valid)', async () => {
      render(<TaskSettings />);

      const variableLabelInput = screen.getByPlaceholderText(/Add Label/i);

      const addButton = screen.getByRole('button', { name: /Add/i });
      expect(addButton).toBeDisabled();

      await user.type(variableLabelInput, newTaskVariableData.label);

      const variableKeyInput = screen.getByPlaceholderText(/Paste Tool here/i);
      expect(addButton).toBeDisabled();

      await user.type(variableKeyInput, newTaskVariableData.value);
      expect(addButton).not.toBeDisabled();
    });

    it('successfully adds a new variable if the label and key entered are valid, cleans the inputs and adds a new item for the variable in ManageYourTools', async () => {
      render(<TaskSettings />);

      const variableLabelInput = screen.getByPlaceholderText(/Add Label/i);
      await user.type(variableLabelInput, newTaskVariableData.label);

      const variableKeyInput = screen.getByPlaceholderText(/Paste Tool here/i);
      await user.type(variableKeyInput, newTaskVariableData.value);

      const addButton = screen.getByRole('button', { name: /Add/i });
      user.click(addButton);

      const newVariableItem = await screen.findByText(
        newTaskVariableData.label
      );

      expect(variableLabelInput).toHaveDisplayValue('');
      expect(variableKeyInput).toHaveDisplayValue('');
      expect(newVariableItem).toBeInTheDocument();
    });
  });

  describe('Delete task variable', () => {
    it('closes the delete modal and keeps the variable item, when clicking on Keep', async () => {
      const existingTaskVariableData = existingTaskVariablesData[0];
      render(<TaskSettings />);

      const variableItem = screen.getByText(existingTaskVariableData.label);
      const deleteItemButton = within(variableItem.parentElement).getByTestId(
        /delete-task-variable/i
      );
      await user.click(deleteItemButton);

      const deleteModal = screen.getByText(deleteModalDescription).parentElement
        .parentElement;
      const keepButton = within(deleteModal).getByRole('button', {
        name: /Keep/i,
      });
      await user.click(keepButton);

      expect(deleteModal).not.toBeInTheDocument();
      expect(variableItem).toBeInTheDocument();
    });

    it('successfully deletes a task variable', async () => {
      const existingTaskVariableData = existingTaskVariablesData[0];
      render(<TaskSettings />);

      const variableItem = screen.getByText(existingTaskVariableData.label);
      const deleteItemButton = within(variableItem.parentElement).getByTestId(
        /delete-task-variable/i
      );
      await user.click(deleteItemButton);

      const deleteModal = screen.getByText(deleteModalDescription).parentElement
        .parentElement;
      const deleteButton = within(deleteModal).getByRole('button', {
        name: /Delete/i,
      });
      await user.click(deleteButton);

      expect(variableItem).not.toBeInTheDocument();
    });

    describe('Edit task variable', () => {
      it('displays the proper error and disables the Save button if the label entered is not valid', async () => {
        const existingTaskVariableData = existingTaskVariablesData[1];
        render(<TaskSettings />);

        const variableItem = screen.getByText(existingTaskVariableData.label);
        const editItemButton = within(variableItem.parentElement).getByTestId(
          /edit-task-variable/i
        );
        await user.click(editItemButton);

        const editModal =
          screen.getByText(editModalDescription).parentElement.parentElement;
        const variableLabelInput = within(editModal).getByDisplayValue(
          existingTaskVariableData.label
        );
        const saveButton = screen.getByRole('button', { name: /Save/i });

        await user.clear(variableLabelInput);
        await user.type(variableLabelInput, 'my label');

        const labelError = await screen.findByText(duplicatedLabelErrorMessage);

        expect(labelError).toBeInTheDocument();
        expect(saveButton).toBeDisabled();
      });

      it('disables the Save button if there is no label or key value entered, and enables it when both are there (and the label is valid)', async () => {
        const existingTaskVariableData = existingTaskVariablesData[1];
        render(<TaskSettings />);

        const variableItem = screen.getByText(existingTaskVariableData.label);
        const editItemButton = within(variableItem.parentElement).getByTestId(
          /edit-task-variable/i
        );
        await user.click(editItemButton);

        const editModal =
          screen.getByText(editModalDescription).parentElement.parentElement;
        const variableLabelInput = within(editModal).getByDisplayValue(
          existingTaskVariableData.label
        );
        const variableKeyInput = screen.getByDisplayValue(
          existingTaskVariableData.value
        );
        const saveButton = screen.getByRole('button', {
          name: /Save Settings/i,
        });

        await user.clear(variableLabelInput);
        await user.clear(variableKeyInput);
        expect(saveButton).toBeDisabled();

        await user.type(variableLabelInput, newTaskVariableData.label);
        expect(saveButton).toBeDisabled();

        await user.type(variableKeyInput, newTaskVariableData.value);
        expect(saveButton).not.toBeDisabled();
      });

      it('edits correctly a task variable', async () => {
        const existingTaskVariableData = existingTaskVariablesData[1];
        render(<TaskSettings />);

        const variableItem = screen.getByText(existingTaskVariableData.label);
        const editItemButton = within(variableItem.parentElement).getByTestId(
          /edit-task-variable/i
        );
        await user.click(editItemButton);

        const editModal =
          screen.getByText(editModalDescription).parentElement.parentElement;
        const variableLabelInput =
          within(editModal).getByPlaceholderText(/Add Label/i);
        await user.clear(variableLabelInput);
        await user.type(variableLabelInput, newTaskVariableData.label);

        const variableKeyInput =
          within(editModal).getByPlaceholderText(/Paste Tool here/i);
        await user.clear(variableKeyInput);
        await user.type(variableKeyInput, newTaskVariableData.value);

        const saveButton = within(editModal).getByRole('button', {
          name: /Save Settings/i,
        });
        user.click(saveButton);

        const updatedItem = await screen.findByText(newTaskVariableData.label);
        const inspectItemButton = within(updatedItem.parentElement).getByTestId(
          /inspect-task-variable/i
        );
        await user.click(inspectItemButton);
        const inspectModal = screen.getByText(inspectModalDescription)
          .parentElement.parentElement;

        const label = within(inspectModal).getByText(newTaskVariableData.label);
        const key = within(inspectModal).getByText(newTaskVariableData.value);

        expect(label).toBeInTheDocument();
        expect(key).toBeInTheDocument();
      });
    });
  });
});
