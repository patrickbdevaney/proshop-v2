import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import { setupServer } from 'msw/node';
import { rest } from 'msw';
import userEvent from '@testing-library/user-event';
import { apiSlice } from '../slices/cartSlice';
import CartScreen from './CartScreen';

const server = setupServer();

describe('CartScreen', () => {
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

  test('renders loading spinner while fetching cart items', () => {
    server.use(
      rest.get('/api/cart', (req, res, ctx) => {
        return res(ctx.delay(1500)); // Delay the response
      })
    );

    render(
      <Provider store={store}>
        <CartScreen />
      </Provider>
    );

    expect(screen.getByRole('status')).toBeInTheDocument();
  });

  test('renders error message on failure', async () => {
    server.use(
      rest.get('/api/cart', (req, res, ctx) => {
        return res(ctx.status(500));
      })
    );

    render(
      <Provider store={store}>
        <CartScreen />
      </Provider>
    );

    await waitFor(() =>
      expect(screen.getByRole('alert')).toHaveTextContent(
        'An error occurred while fetching cart items. Please try again.'
      )
    );
  });

  test('renders cart items on success', async () => {
    const cartItems = [
      {
        _id: '1',
        name: 'Test Item',
        image: 'test.jpg',
        price: 100,
        countInStock: 5,
        qty: 1,
      },
   
    ];
    server.use(
      rest.get('/api/cart', (req, res, ctx) => {
        return res(ctx.json(cartItems));
      })
    );

    render(
      <Provider store={store}>
        <CartScreen />
      </Provider>
    );

    await waitFor(() =>
      cartItems.forEach((item) => {
        expect(screen.getByText(item.name)).toBeInTheDocument();
        expect(screen.getByText(`$${item.price}`)).toBeInTheDocument();
      })
    );
  });

  test('handles remove from cart', async () => {
    const cartItems = [
      {
        _id: '1',
        name: 'Test Item',
        image: 'test.jpg',
        price: 100,
        countInStock: 5,
        qty: 1,
      },
    ];
    server.use(
      rest.get('/api/cart', (req, res, ctx) => {
        return res(ctx.json(cartItems));
      }),
      rest.delete('/api/cart/:id', (req, res, ctx) => {
        return res(ctx.status(200));
      })
    );

    render(
      <Provider store={store}>
        <CartScreen />
      </Provider>
    );

    await waitFor(() => screen.getByText('Remove'));

    userEvent.click(screen.getByText('Remove'));
    await waitFor(() =>
      expect(screen.queryByText(cartItems[0].name)).not.toBeInTheDocument()
    );
  });
});
