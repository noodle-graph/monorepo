import { render, screen } from '@testing-library/react';
import React from 'react';

import { App } from './App';

test('Dummy test', async () => {
    render(<App />);
    const tagsFilterTitle = screen.getByText(/Tags/i);
    expect(tagsFilterTitle).toBeInTheDocument();
});
