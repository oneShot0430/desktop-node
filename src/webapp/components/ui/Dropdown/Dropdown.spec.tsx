import { render, fireEvent } from '@testing-library/react';
import React from 'react';

import { Dropdown } from './Dropdown';

const items = [
  { label: 'First item', disabled: false, id: '1' },
  { label: 'Second item', disabled: true, id: '2' },
  { label: 'Third item', disabled: false, id: '3' },
];

describe('Dropdown', () => {
  it('should render without crashing', () => {
    const { container } = render(<Dropdown items={items} />);
    expect(container).toBeTruthy();
  });

  it('should display placeholder text when no item is selected', () => {
    const { getByText } = render(<Dropdown items={items} />);
    expect(getByText('Select item')).toBeInTheDocument();
  });

  it('should display the selected item text', () => {
    const { getByText } = render(<Dropdown items={items} />);
    fireEvent.click(getByText('Select item'));
    fireEvent.click(getByText('First item'));
    expect(getByText('First item')).toBeInTheDocument();
  });

  it('should call the onSelect callback when an item is selected', () => {
    const onSelect = jest.fn();
    const { getByText } = render(
      <Dropdown items={items} onSelect={onSelect} />
    );
    fireEvent.click(getByText('Select item'));
    fireEvent.click(getByText('First item'));
    expect(onSelect).toHaveBeenCalledWith({
      label: 'First item',
      disabled: false,
    });
  });
});
