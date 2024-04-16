import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import { setupServer } from 'msw/node';
import { rest } from 'msw';
import userEvent from '@testing-library/user-event';
import { apiSlice } from '../slices/usersApiSlice';
import RegisterScreen from './RegisterScreen';

const server = setupServer();

describe('RegisterScreen', () => {
  let store;

  beforeEach(() => {
    store = configureStore({
      reducer: {
        [apiSlice.reducerPath]: apiSlice.reducer,
      },
      middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware().concat(apiSlice.middleware),
    });
  });

  beforeAll(() => server.listen());
  afterEach(() => server.resetHandlers());
  afterAll(() => server.close());

  test('renders form fields', () => {
    render(
      <Provider store={store}>
        <RegisterScreen />
      </Provider>
    );

    expect(screen.getByLabelText('Name')).toBeInTheDocument();
    expect(screen.getByLabelText('Email')).toBeInTheDocument();
    expect(screen.getByLabelText('Password')).toBeInTheDocument();
    expect(screen.getByLabelText('Confirm Password')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /register/i })).toBeInTheDocument();
  });

  test('handles form submit', async () => {
    server.use(
      rest.post('/api/users', (req, res, ctx) => {
        return res(ctx.status(200));
      })
    );

    render(
      <Provider store={store}>
        <RegisterScreen />
      </Provider>
    );

    userEvent.type(screen.getByLabelText('Name'), 'Test User');
    userEvent.type(screen.getByLabelText('Email'), 'test@example.com');
    userEvent.type(screen.getByLabelText('Password'), 'password');
    userEvent.type(screen.getByLabelText('Confirm Password'), 'password');
    userEvent.click(screen.getByRole('button', { name: /register/i }));

    await waitFor(() =>
      expect(screen.queryByRole('status')).not.toBeInTheDocument()
    );
  });

  test('handles form submit with mismatched passwords', async () => {
    server.use(
      rest.post('/api/users', (req, res, ctx) => {
        return res(ctx.status(200));
      })
    );

    render(
      <Provider store={store}>
        <RegisterScreen />
      </Provider>
    );

    userEvent.type(screen.getByLabelText('Name'), 'Test User');
    userEvent.type(screen.getByLabelText('Email'), 'test@example.com');
    userEvent.type(screen.getByLabelText('Password'), 'password');
    userEvent.type(screen.getByLabelText('Confirm Password'), 'different');
    userEvent.click(screen.getByRole('button', { name: /register/i }));

    await waitFor(() =>
      expect(screen.getByRole('alert')).toHaveTextContent(
        'Passwords do not match'
      )
    );
  });
});
