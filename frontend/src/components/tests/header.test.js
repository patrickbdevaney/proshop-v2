import React from 'react';
import { render, screen } from '@testing-library/react';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import userEvent from '@testing-library/user-event';
import Header from './Header';
import authReducer from '../slices/authSlice';
import cartReducer from '../slices/cartSlice';

describe('Header', () => {
  let store;

  beforeEach(() => {
    store = configureStore({
      reducer: {
        auth: authReducer,
        cart: cartReducer,
      },
    });
  });

  test('renders ProShop logo', () => {
    render(
      <Provider store={store}>
        <Header />
      </Provider>
    );

    expect(screen.getByAltText('ProShop')).toBeInTheDocument();
  });

  test('renders Sign In link when user is not authenticated', () => {
    render(
      <Provider store={store}>
        <Header />
      </Provider>
    );

    expect(screen.getByText('Sign In')).toBeInTheDocument();
  });

  test('renders UserDropdown when user is authenticated', () => {
    // Mock authenticated state
    store.dispatch({ type: 'auth/setCredentials', payload: { name: 'Test User' } });

    render(
      <Provider store={store}>
        <Header />
      </Provider>
    );

    userEvent.click(screen.getByText('Test User'));

    expect(screen.getByText('Profile')).toBeInTheDocument();
    expect(screen.getByText('Logout')).toBeInTheDocument();
  });


});
