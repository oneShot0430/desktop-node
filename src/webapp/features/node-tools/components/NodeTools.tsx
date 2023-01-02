import {
  Button,
  ButtonSize,
  ButtonVariant,
  CheckSuccessLine,
  Icon,
} from '@_koii/koii-styleguide';
import React from 'react';

import { useTaskVariablesNames } from '../hooks';

import { NodeTool } from './NodeTool';

type PropsType = {
  taskPubKey: string;
};

const confirmTaskVariables = () => {
  /**
   * @todo: Implement this function
   */
  console.log('confirmTaskVariables');
};

export const NodeTools = ({ taskPubKey }: PropsType) => {
  const { taskVariablesNamesQuery } = useTaskVariablesNames({ taskPubKey });

  const {
    data: taskVariablesNames,
    isLoading,
    // isError,
  } = taskVariablesNamesQuery;

  const variableNames = taskVariablesNames && taskVariablesNames.slice(0, 3);

  return (
    <div className="w-full pb-4 pr-4">
      {isLoading && <div>Loading...</div>}
      {!isLoading && (
        <>
          {variableNames.map((tool) => (
            <NodeTool
              tool={tool}
              key={tool}
              getSecretLink="https://google.com"
            />
          ))}
          <div className="flex justify-end">
            <Button
              variant={ButtonVariant.Primary}
              size={ButtonSize.SM}
              label="Confirm All"
              iconLeft={<Icon source={CheckSuccessLine} />}
              onClick={confirmTaskVariables}
            />
          </div>
        </>
      )}
    </div>
  );
};
