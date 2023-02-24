import '@testing-library/jest-dom';
import { render } from '@testing-library/react';
import React from 'react';

import App from '../webapp/App';

describe('App', () => {
  it('should render', () => {
    expect(render(<App />)).toBeTruthy();
  });
});
