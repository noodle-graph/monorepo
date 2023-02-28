import { render, screen } from '@testing-library/react';
import React from 'react';

import { App } from '../App';

test('Loading...', async () => {
    render(<App />);
    const tagsFilterTitle = screen.getByText(/Loading\.\.\./i);
    expect(tagsFilterTitle).toBeInTheDocument();
});
