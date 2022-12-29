import {
  Button,
  ButtonSize,
  ButtonVariant,
  CheckSuccessLine,
  Icon,
} from '@_koii/koii-styleguide';
import React from 'react';

import { Dropdown } from 'webapp/components';

import { useStoredTaskVariables } from '../hooks';

type PropsType = {
  tool: string;
  getSecretLink?: string;
};

export const NodeTool = ({ tool, getSecretLink }: PropsType) => {
  const { storedTaskVariablesQuery } = useStoredTaskVariables();
  const { data: taskVariables, isLoading, isError } = storedTaskVariablesQuery;

  // const transformedTaskVariables = Object.keys(taskVariables).reduce(
  //   (acc, key) => {
  //     const value = taskVariables[key];
  //     if (value) {
  //       acc.push({ label: key, id: key });
  //     } else {
  //       acc.push({ label: key, id: key, disabled: true });
  //     }
  //     return acc;
  //   },
  //   []
  // );

  // console.log('@@@taskVariables', transformedTaskVariables);

  const items = [
    { label: 'First item', disabled: false, id: '1' },
    { label: 'Second item', disabled: true, id: '2' },
    { label: 'Third item', disabled: false, id: '3' },
  ];

  console.log('###taskVariables', taskVariables);

  return (
    <div className="flex justify-between w-full">
      <div>
        <div className="mb-2 font-semibold text-finnieTeal">{tool}</div>
        {getSecretLink && (
          <div className="text-xs">
            Don’t have one yet?{' '}
            <a
              href={getSecretLink}
              className="font-normal underline cursor-pointer text-orange-2"
            >
              Click here to get it.
            </a>
          </div>
        )}
      </div>
      <div className="flex items-start gap-3 pt-[2px]">
        <Dropdown items={items} validationError="wrong tool" />
        <Button
          variant={ButtonVariant.Primary}
          size={ButtonSize.SM}
          label="I'm Done"
          iconLeft={<Icon source={CheckSuccessLine} />}
        />
      </div>
    </div>
  );
};
