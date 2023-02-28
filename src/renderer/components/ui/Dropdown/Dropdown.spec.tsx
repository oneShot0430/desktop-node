import { render, fireEvent, screen } from '@testing-library/react';
import React from 'react';

import { Dropdown } from './Dropdown';

const items = [
  { label: 'First item', disabled: false, id: '1' },
  { label: 'Second item', disabled: true, id: '2' },
  { label: 'Third item', disabled: false, id: '3' },
];

describe('Dropdown', () => {
  it('should render without crashing', () => {
    render(<Dropdown items={items} />);
    expect(screen.getByTestId('koii_dropdown_test_id')).toBeInTheDocument();
  });

  it('should display placeholder text when no item is selected', () => {
    render(<Dropdown items={items} />);
    expect(screen.getByText('Select item')).toBeInTheDocument();
  });

  it('should display the selected item text', () => {
    render(<Dropdown items={items} />);
    fireEvent.click(screen.getByText('Select item'));
    fireEvent.click(screen.getByText('First item'));
    expect(screen.getByText('First item')).toBeInTheDocument();
  });

  it('should call the onSelect callback when an item is selected', () => {
    const onSelect = jest.fn();
    render(<Dropdown items={items} onSelect={onSelect} />);
    fireEvent.click(screen.getByText('Select item'));
    fireEvent.click(screen.getByText('First item'));
    expect(onSelect).toHaveBeenCalledWith({
      label: 'First item',
      disabled: false,
      id: '1',
    });
  });
});
