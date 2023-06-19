import { ChevronArrowLine, Icon } from '@_koii/koii-styleguide';
import { Listbox, Transition } from '@headlessui/react';
import React, {
  Fragment,
  forwardRef,
  useCallback,
  useEffect,
  useState,
} from 'react';
import { twMerge } from 'tailwind-merge';

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
  emptyListItemSlot?: React.ReactNode;
  bottom?: boolean;
  customItem?: React.ReactNode;
};

/**
 * @todo:
 * This component shoudl finally be moved to the @_koii/koii-styleguide
 */
export const Dropdown = forwardRef<HTMLButtonElement, DropdownProps>(
  (
    {
      items = [],
      onSelect,
      placeholderText = 'Select item',
      defaultValue = null,
      validationError,
      emptyListItemSlot,
      bottom,
      customItem,
    }: DropdownProps,
    ref
  ) => {
    const [selected, setSelected] = useState<DropdownItem | null>(defaultValue);

    // Sets default even if it comes as undefined in the first render
    useEffect(() => {
      if (defaultValue) {
        setSelected(defaultValue);
      }
    }, [defaultValue]);

    const handleItemSelect = useCallback(
      (item: DropdownItem) => {
        if (item.disabled) return;

        onSelect?.(item);
        setSelected(item);
      },
      [onSelect]
    );

    const optionsClasses = twMerge(
      'absolute z-50 w-full py-1 mt-1 overflow-auto text-base text-white rounded-md shadow-lg bg-purple-5 max-h-60 focus:outline-none sm:text-sm',
      bottom ? 'top-9' : 'bottom-10'
      /**
       * @dev when this component will go to styleguide, this logic should be abstracted away and probably we should make
       * possible to add dropdown items using "slot pattern"
       */
    );

    const getItemClasses = useCallback(
      (selected: boolean, item: DropdownItem) => {
        const itemClasses = twMerge(
          'block truncate py-1 pl-10 pr-4 font-normal text-white border-2 border-transparent',
          selected &&
            'border-2 border-purple-1 font-semibold rounded-lg text-finnieTeal-100',
          item.disabled && 'text-gray-500 cursor-not-allowed'
          /**
           * @dev when this component will go to styleguide, this logic should be abstracted away and probably we should make
           * possible to add dropdown items using "slot pattern"
           */
        );

        return itemClasses;
      },
      []
    );

    const emptyListItem = emptyListItemSlot || (
      <div className="text-gray-500 cursor-not-allowed flex justify-center py-2">
        No items
      </div>
    );

    const dropdownItems = items.map((item) => (
      <Listbox.Option
        key={item.id}
        className={({ active }) =>
          `relative cursor-default select-none ${
            active && 'bg-purple-1 text-finnieTeal-100'
          }`
        }
        value={item}
        disabled={item.disabled}
      >
        {({ selected }) => (
          <span className={getItemClasses(selected, item)}>{item.label}</span>
        )}
      </Listbox.Option>
    ));

    // if (customItem) {
    //   dropdownItems.push(customItem as React.ReactElement);
    // }

    return (
      <div className="h-full w-72" data-testid="koii_dropdown_test_id">
        <Listbox value={selected} onChange={handleItemSelect}>
          <div className="relative">
            <Listbox.Button
              ref={ref}
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
              <Listbox.Options className={optionsClasses}>
                {!items.length ? emptyListItem : dropdownItems}
                {customItem}
              </Listbox.Options>
            </Transition>
          </div>
        </Listbox>
      </div>
    );
  }
);

Dropdown.displayName = 'Dropdown';
