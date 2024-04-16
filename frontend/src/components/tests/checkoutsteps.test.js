import React from 'react';
import { render, screen } from '@testing-library/react';
import CheckoutSteps from './CheckoutSteps';

describe('CheckoutSteps', () => {
  test('renders all steps correctly', () => {
    render(<CheckoutSteps step1 step2 step3 step4 />);

    expect(screen.getByText('Sign In')).toBeInTheDocument();
    expect(screen.getByText('Shipping')).toBeInTheDocument();
    expect(screen.getByText('Payment')).toBeInTheDocument();
    expect(screen.getByText('Place Order')).toBeInTheDocument();
  });

  test('disables steps correctly', () => {
    render(<CheckoutSteps step1 />);

    expect(screen.getByText('Sign In')).not.toHaveAttribute('disabled');
    expect(screen.getByText('Shipping')).toHaveAttribute('disabled');
    expect(screen.getByText('Payment')).toHaveAttribute('disabled');
    expect(screen.getByText('Place Order')).toHaveAttribute('disabled');
  });


});
