import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter, Route } from 'react-router-dom';
import SearchBox from './SearchBox';

describe('SearchBox', () => {
  test('renders SearchBox component', () => {
    render(
      <MemoryRouter>
        <SearchBox />
      </MemoryRouter>
    );

    expect(screen.getByPlaceholderText('Search Products...')).toBeInTheDocument();
  });

  test('handles input change', () => {
    render(
      <MemoryRouter>
        <SearchBox />
      </MemoryRouter>
    );

    userEvent.type(screen.getByPlaceholderText('Search Products...'), 'test');
    expect(screen.getByPlaceholderText('Search Products...')).toHaveValue('test');
  });

  test('handles form submit', () => {
    const { history } = render(
      <MemoryRouter initialEntries={['/']}>
        <Route path='/' component={SearchBox} />
      </MemoryRouter>
    );

    userEvent.type(screen.getByPlaceholderText('Search Products...'), 'test');
    userEvent.click(screen.getByRole('button', { name: /search/i }));

    expect(history.location.pathname).toBe('/search/test');
  });
});
