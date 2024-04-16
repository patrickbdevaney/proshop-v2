import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import { setupServer } from 'msw/node';
import { rest } from 'msw';
import userEvent from '@testing-library/user-event';
import { apiSlice } from '../../slices/usersApiSlice';
import UserEditScreen from './UserEditScreen';

const server = setupServer();

describe('UserEditScreen', () => {
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

  test('renders loading spinner while fetching user details', () => {
    server.use(
      rest.get('/api/users/:id', (req, res, ctx) => {
        return res(ctx.delay(1500)); // Delay the response
      })
    );

    render(
      <Provider store={store}>
        <UserEditScreen />
      </Provider>
    );

    expect(screen.getByRole('status')).toBeInTheDocument();
  });

  test('renders error message on failure', async () => {
    server.use(
      rest.get('/api/users/:id', (req, res, ctx) => {
        return res(ctx.status(500));
      })
    );

    render(
      <Provider store={store}>
        <UserEditScreen />
      </Provider>
    );

    await waitFor(() =>
      expect(screen.getByRole('alert')).toHaveTextContent(
        'An error occurred while fetching user details. Please try again.'
      )
    );
  });

  test('renders user details on success', async () => {
    const user = {
      _id: '1',
      name: 'Test User',
      email: 'test@example.com',
      isAdmin: false,
    };
    server.use(
      rest.get('/api/users/:id', (req, res, ctx) => {
        return res(ctx.json(user));
      })
    );

    render(
      <Provider store={store}>
        <UserEditScreen />
      </Provider>
    );

    await waitFor(() => {
      expect(screen.getByDisplayValue(user.name)).toBeInTheDocument();
      expect(screen.getByDisplayValue(user.email)).toBeInTheDocument();
      expect(screen.getByLabelText('Is Admin')).not.toBeChecked();
    });
  });

  test('handles form submit', async () => {
    const user = {
      _id: '1',
      name: 'Test User',
      email: 'test@example.com',
      isAdmin: false,
    };
    server.use(
      rest.get('/api/users/:id', (req, res, ctx) => {
        return res(ctx.json(user));
      }),
      rest.put('/api/users/:id', (req, res, ctx) => {
        return res(ctx.status(200));
      })
    );

    render(
      <Provider store={store}>
        <UserEditScreen />
      </Provider>
    );

    await waitFor(() => screen.getByDisplayValue(user.name));

    userEvent.type(screen.getByDisplayValue(user.name), 'Updated Name');
    userEvent.type(screen.getByDisplayValue(user.email), 'updated@example.com');
    userEvent.click(screen.getByLabelText('Is Admin'));
    userEvent.click(screen.getByRole('button', { name: /update/i }));

    await waitFor(() =>
      expect(screen.queryByRole('status')).not.toBeInTheDocument()
    );
  });
});
