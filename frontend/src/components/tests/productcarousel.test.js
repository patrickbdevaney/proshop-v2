import React from 'react';
import { render, screen } from '@testing-library/react';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import { setupServer } from 'msw/node';
import { rest } from 'msw';
import { apiSlice } from '../slices/productsApiSlice';
import ProductCarousel from './ProductCarousel';

const server = setupServer();

describe('ProductCarousel', () => {
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
      rest.get('/api/products/top', (req, res, ctx) => {
        return res(ctx.delay(1500)); // Delay the response
      })
    );

    render(
      <Provider store={store}>
        <ProductCarousel />
      </Provider>
    );

    expect(screen.getByRole('status')).toBeInTheDocument();
  });

  test('renders error message on failure', async () => {
    server.use(
      rest.get('/api/products/top', (req, res, ctx) => {
        return res(ctx.status(500));
      })
    );

    render(
      <Provider store={store}>
        <ProductCarousel />
      </Provider>
    );

    expect(await screen.findByRole('alert')).toBeInTheDocument();
  });

  test('renders product carousel on success', async () => {
    const products = [
      { _id: '1', name: 'Product 1', image: 'image1.jpg', price: 100 },
      { _id: '2', name: 'Product 2', image: 'image2.jpg', price: 200 },
    ];
    server.use(
      rest.get('/api/products/top', (req, res, ctx) => {
        return res(ctx.json(products));
      })
    );

    render(
      <Provider store={store}>
        <ProductCarousel />
      </Provider>
    );

    expect(await screen.findByText('Product 1')).toBeInTheDocument();
    expect(screen.getByText('Product 2')).toBeInTheDocument();
  });
});
