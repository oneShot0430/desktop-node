import { ChevronArrowFill } from '@_koii/koii-styleguide';
import { Listbox, Transition } from '@headlessui/react';
import React, { Fragment, useCallback, useState } from 'react';

export type DropdownItem = {
  label: string;
  disabled?: boolean;
};

export type DropdownProps = {
  items: DropdownItem[];
  placeholderText?: string;
  onSelect?: (item: DropdownItem) => void;
};

export const Dropdown = ({
  items = [],
  onSelect,
  placeholderText = 'Select item',
}: DropdownProps) => {
  const [selected, setSelected] = useState<DropdownItem>();
  const handleItemSelect = useCallback(
    (item: DropdownItem) => {
      setSelected(item);
      if (onSelect && typeof onSelect === 'function') {
        onSelect(item);
      }
    },
    [onSelect]
  );

  return (
    <div className="fixed top-16 w-72">
      <Listbox value={selected} onChange={handleItemSelect}>
        <div className="relative mt-1">
          <Listbox.Button
            placeholder={placeholderText}
            className="relative w-full py-2 pl-3 pr-10 text-sm text-left rounded-lg shadow-md cursor-default text-gray bg-purple-5 focus:outline-none focus-visible:ring-2 sm:text-sm"
          >
            {selected ? (
              <span className="block text-white truncate">
                {selected.label}
              </span>
            ) : (
              <span>{placeholderText}</span>
            )}
            <span className="absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none">
              <ChevronArrowFill
                className="w-5 h-5 text-gray-400"
                aria-hidden="true"
              />
            </span>
          </Listbox.Button>
          <Transition
            as={Fragment}
            leave="transition ease-in duration-100"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <Listbox.Options className="absolute z-50 w-full py-1 mt-1 overflow-auto text-base text-white rounded-md shadow-lg bg-purple-5 max-h-60 focus:outline-none sm:text-sm">
              {items.map((item, itemIndex) => (
                <Listbox.Option
                  key={itemIndex}
                  className={({ active }) =>
                    `relative cursor-default select-none ${
                      active && 'bg-purple-1 text-finnieTeal-100'
                    }`
                  }
                  value={item}
                  disabled={item?.disabled}
                >
                  {({ selected }) => (
                    <>
                      <span
                        className={`block truncate py-2 pl-10 pr-4  ${
                          selected
                            ? 'border-2 border-purple-1 font-semibold rounded-lg text-finnieTeal-100'
                            : 'font-normal text-white'
                        }`}
                      >
                        {item?.label}
                      </span>
                    </>
                  )}
                </Listbox.Option>
              ))}
            </Listbox.Options>
          </Transition>
        </div>
      </Listbox>
    </div>
  );
};
