import React from 'react';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import Paginate from './Paginate';

describe('Paginate', () => {
  test('renders pagination for multiple pages', () => {
    render(
      <MemoryRouter>
        <Paginate pages={5} page={1} />
      </MemoryRouter>
    );

    expect(screen.getByText('1')).toHaveClass('active');
    expect(screen.getByText('2')).not.toHaveClass('active');
    expect(screen.getByText('3')).not.toHaveClass('active');
    expect(screen.getByText('4')).not.toHaveClass('active');
    expect(screen.getByText('5')).not.toHaveClass('active');
  });

  test('does not render pagination for a single page', () => {
    render(
      <MemoryRouter>
        <Paginate pages={1} page={1} />
      </MemoryRouter>
    );

    expect(screen.queryByText('1')).toBeNull();
  });
});
