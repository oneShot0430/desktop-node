import { render, screen } from '@testing-library/react';
import React from 'react';

import { Secrets } from './Secrets';

describe('Secrets', () => {
  it('should render successfully', () => {
    render(<Secrets />);
    expect(screen.getByTestId('secrets')).toBeInTheDocument();
  });
});
