import React from 'react';
import { render, screen } from '@testing-library/react';
import { BrowserRouter as Router } from 'react-router-dom';
import Product from './Product';

describe('Product', () => {
  const product = {
    _id: '1',
    image: 'test.jpg',
    name: 'Test Product',
    rating: 4.5,
    numReviews: 10,
    price: 100,
  };

  test('renders Product component', () => {
    render(
      <Router>
        <Product product={product} />
      </Router>
    );

    expect(screen.getByText('Test Product')).toBeInTheDocument();
    expect(screen.getByText('4.5')).toBeInTheDocument();
    expect(screen.getByText('10 reviews')).toBeInTheDocument();
    expect(screen.getByText('$100')).toBeInTheDocument();
  });

});
