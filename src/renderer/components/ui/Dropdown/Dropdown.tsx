import { ChevronArrowLine, Icon } from '@_koii/koii-styleguide';
import { Listbox, Transition } from '@headlessui/react';
import React, { Fragment, useCallback, useState } from 'react';
import { twMerge } from 'tailwind-merge';

import { OMITTED_VARIABLE_IDENTIFIER } from 'models';

import { ErrorMessage } from '../ErrorMessage';

export type DropdownItem = {
  label: string;
  id: string;
  disabled?: boolean;
};

export type DropdownProps = {
  items: DropdownItem[];
  placeholderText?: string;
  onSelect?: (item: DropdownItem) => void;
  defaultValue?: DropdownItem | null;
  validationError?: string;
};

/**
 * @todo:
 * This component shoudl finally be moved to the @_koii/koii-styleguide
 */
export function Dropdown({
  items = [],
  onSelect,
  placeholderText = 'Select item',
  defaultValue = null,
  validationError,
}: DropdownProps) {
  const [selected, setSelected] = useState<DropdownItem | null>(defaultValue);
  const handleItemSelect = useCallback(
    (item: DropdownItem) => {
      onSelect?.(item);
      setSelected(item);
    },
    [onSelect]
  );

  const getItemClasses = useCallback(
    (selected: boolean, item: DropdownItem) => {
      const itemClasses = twMerge(
        'block truncate py-1 pl-10 pr-4 font-normal text-white border-2 border-transparent',
        selected &&
          'border-2 border-purple-1 font-semibold rounded-lg text-finnieTeal-100',
        item.disabled && 'text-gray-500 cursor-not-allowed',
        /**
         * @dev when this component will go to styleguide, this logic should be abstracted away and probably we should make
         * possible to add dropdown items using "slot pattern"
         */
        item.id === OMITTED_VARIABLE_IDENTIFIER && 'text-finnieOrange'
      );

      return itemClasses;
    },
    []
  );

  return (
    <div className="h-full w-72" data-testid="koii_dropdown_test_id">
      <Listbox value={selected} onChange={handleItemSelect}>
        <div className="relative">
          <Listbox.Button
            placeholder={placeholderText}
            className="relative w-full py-2 pl-3 pr-10 text-sm text-left rounded-lg shadow-md cursor-default text-gray bg-purple-5 focus:outline-none focus-visible:ring-2 focus-visible:ring-finnieTeal sm:text-sm"
          >
            {selected ? (
              <span className="block text-white truncate">
                {selected.label}
              </span>
            ) : (
              <span>{placeholderText}</span>
            )}
            <span className="absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none ">
              <Icon
                source={ChevronArrowLine}
                className="w-4 h-4 m-1 rotate-180"
                aria-hidden="true"
              />
            </span>
          </Listbox.Button>
          {validationError ? (
            <ErrorMessage error={validationError} className="pt-1 text-xs" />
          ) : (
            <div className="pt-2" />
          )}
          <Transition
            as={Fragment}
            leave="transition ease-in duration-100"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <Listbox.Options className="absolute z-50 w-full py-1 mt-1 overflow-auto text-base text-white rounded-md shadow-lg top-9 bg-purple-5 max-h-60 focus:outline-none sm:text-sm">
              {items.map((item, itemIndex) => (
                <Listbox.Option
                  key={item?.id ?? itemIndex}
                  className={({ active }) =>
                    `relative cursor-default select-none ${
                      active && 'bg-purple-1 text-finnieTeal-100'
                    }`
                  }
                  value={item}
                  disabled={item?.disabled}
                >
                  {({ selected }) => (
                    <span className={getItemClasses(selected, item)}>
                      {item?.label}
                    </span>
                  )}
                </Listbox.Option>
              ))}
            </Listbox.Options>
          </Transition>
        </div>
      </Listbox>
    </div>
  );
}
