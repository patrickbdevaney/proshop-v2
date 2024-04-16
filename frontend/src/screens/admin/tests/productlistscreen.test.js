import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import { setupServer } from 'msw/node';
import { rest } from 'msw';
import userEvent from '@testing-library/user-event';
import { apiSlice } from '../../slices/productsApiSlice';
import ProductListScreen from './ProductListScreen';

const server = setupServer();

describe('ProductListScreen', () => {
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

  test('renders loading spinner while fetching products', () => {
    server.use(
      rest.get('/api/products', (req, res, ctx) => {
        return res(ctx.delay(1500)); // Delay the response
      })
    );

    render(
      <Provider store={store}>
        <ProductListScreen />
      </Provider>
    );

    expect(screen.getByRole('status')).toBeInTheDocument();
  });

  test('renders error message on failure', async () => {
    server.use(
      rest.get('/api/products', (req, res, ctx) => {
        return res(ctx.status(500));
      })
    );

    render(
      <Provider store={store}>
        <ProductListScreen />
      </Provider>
    );

    await waitFor(() =>
      expect(screen.getByRole('alert')).toHaveTextContent(
        'An error occurred while fetching orders. Please try again.'
      )
    );
  });

  test('renders product list on success', async () => {
    const products = [
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
      rest.get('/api/products', (req, res, ctx) => {
        return res(ctx.json(products));
      })
    );

    render(
      <Provider store={store}>
        <ProductListScreen />
      </Provider>
    );

    await waitFor(() =>
      products.forEach((product) => {
        expect(screen.getByText(product._id)).toBeInTheDocument();
        expect(screen.getByText(product.user.name)).toBeInTheDocument();
        expect(screen.getByText(product.totalPrice)).toBeInTheDocument();
      })
    );
  });

  test('handles delete product confirmation', async () => {
    const products = [
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
      rest.get('/api/products', (req, res, ctx) => {
        return res(ctx.json(products));
      }),
      rest.delete('/api/products/1', (req, res, ctx) => {
        return res(ctx.status(200));
      })
    );

    render(
      <Provider store={store}>
        <ProductListScreen />
      </Provider>
    );

    await waitFor(() => screen.getByText('Delete'));

    userEvent.click(screen.getByText('Delete'));
    expect(screen.getByRole('dialog')).toBeInTheDocument();

    userEvent.click(screen.getByText('Confirm'));
    await waitFor(() =>
      expect(screen.queryByText(product._id)).not.toBeInTheDocument()
    );
  });
});
