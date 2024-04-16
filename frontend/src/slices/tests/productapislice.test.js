import { renderHook } from '@testing-library/react-hooks';
import { setupServer } from 'msw/node';
import { rest } from 'msw';
import { PRODUCTS_URL } from '../constants';
import { productsApiSlice, apiSlice } from './apiSlice';

const server = setupServer();

beforeAll(() => server.listen());
afterEach(() => server.resetHandlers());
afterAll(() => server.close());

describe('productsApiSlice', () => {
  test('useGetProductsQuery', async () => {
    const mockData = [{ id: 1, name: 'Product 1' }, { id: 2, name: 'Product 2' }];
    server.use(
      rest.get(PRODUCTS_URL, (req, res, ctx) => {
        return res(ctx.json(mockData));
      })
    );

    const { result, waitFor } = renderHook(() =>
      productsApiSlice.useGetProductsQuery({ keyword: 'test', pageNumber: 1 })
    );
    await waitFor(() => result.current.isSuccess);

    expect(result.current.data).toEqual(mockData);
  });

 
});
