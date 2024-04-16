import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import { setupServer } from 'msw/node';
import { rest } from 'msw';
import { apiSlice } from '../../slices/ordersApiSlice';
import OrderListScreen from './OrderListScreen';

const server = setupServer();

describe('OrderListScreen', () => {
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

  test('renders loading spinner while fetching orders', () => {
    server.use(
      rest.get('/api/orders', (req, res, ctx) => {
        return res(ctx.delay(1500)); // Delay the response
      })
    );

    render(
      <Provider store={store}>
        <OrderListScreen />
      </Provider>
    );

    expect(screen.getByRole('status')).toBeInTheDocument();
  });

  test('renders error message on failure', async () => {
    server.use(
      rest.get('/api/orders', (req, res, ctx) => {
        return res(ctx.status(500));
      })
    );

    render(
      <Provider store={store}>
        <OrderListScreen />
      </Provider>
    );

    await waitFor(() =>
      expect(screen.getByRole('alert')).toHaveTextContent(
        'An error occurred while fetching orders. Please try again.'
      )
    );
  });

  test('renders order list on success', async () => {
    const orders = [
      {
        _id: '1',
        user: { name: 'Test User' },
        createdAt: new Date().toISOString(),
        totalPrice: 100,
        isPaid: true,
        paidAt: new Date().toISOString(),
        isDelivered: false,
      },
    
    ];
    server.use(
      rest.get('/api/orders', (req, res, ctx) => {
        return res(ctx.json(orders));
      })
    );

    render(
      <Provider store={store}>
        <OrderListScreen />
      </Provider>
    );

    await waitFor(() =>
      orders.forEach((order) => {
        expect(screen.getByText(order._id)).toBeInTheDocument();
        expect(screen.getByText(order.user.name)).toBeInTheDocument();
        expect(screen.getByText(order.totalPrice)).toBeInTheDocument();
      })
    );
  });
});
