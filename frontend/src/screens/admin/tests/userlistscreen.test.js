import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import { setupServer } from 'msw/node';
import { rest } from 'msw';
import userEvent from '@testing-library/user-event';
import { apiSlice } from '../../slices/usersApiSlice';
import UserListScreen from './UserListScreen';

const server = setupServer();

describe('UserListScreen', () => {
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

  test('renders loading spinner while fetching users', () => {
    server.use(
      rest.get('/api/users', (req, res, ctx) => {
        return res(ctx.delay(1500)); // Delay the response
      })
    );

    render(
      <Provider store={store}>
        <UserListScreen />
      </Provider>
    );

    expect(screen.getByRole('status')).toBeInTheDocument();
  });

  test('renders error message on failure', async () => {
    server.use(
      rest.get('/api/users', (req, res, ctx) => {
        return res(ctx.status(500));
      })
    );

    render(
      <Provider store={store}>
        <UserListScreen />
      </Provider>
    );

    await waitFor(() =>
      expect(screen.getByRole('alert')).toHaveTextContent(
        'An error occurred while fetching users. Please try again.'
      )
    );
  });

  test('renders user list on success', async () => {
    const users = [
      {
        _id: '1',
        name: 'Test User',
        email: 'test@example.com',
        isAdmin: false,
      },
   
    ];
    server.use(
      rest.get('/api/users', (req, res, ctx) => {
        return res(ctx.json(users));
      })
    );

    render(
      <Provider store={store}>
        <UserListScreen />
      </Provider>
    );

    await waitFor(() =>
      users.forEach((user) => {
        expect(screen.getByText(user._id)).toBeInTheDocument();
        expect(screen.getByText(user.name)).toBeInTheDocument();
        expect(screen.getByText(user.email)).toBeInTheDocument();
      })
    );
  });

  test('handles delete user confirmation', async () => {
    const users = [
      {
        _id: '1',
        name: 'Test User',
        email: 'test@example.com',
        isAdmin: false,
      },
    ];
    server.use(
      rest.get('/api/users', (req, res, ctx) => {
        return res(ctx.json(users));
      }),
      rest.delete('/api/users/:id', (req, res, ctx) => {
        return res(ctx.status(200));
      })
    );

    render(
      <Provider store={store}>
        <UserListScreen />
      </Provider>
    );

    await waitFor(() => screen.getByText('Delete'));

    userEvent.click(screen.getByText('Delete'));
    expect(screen.getByRole('dialog')).toBeInTheDocument();

    userEvent.click(screen.getByText('Confirm'));
    await waitFor(() =>
      expect(screen.queryByText(users[0]._id)).not.toBeInTheDocument()
    );
  });
});
