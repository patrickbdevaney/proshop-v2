import { renderHook } from '@testing-library/react-hooks';
import { setupServer } from 'msw/node';
import { rest } from 'msw';
import { ORDERS_URL, PAYPAL_URL } from '../constants';
import { orderApiSlice, apiSlice } from '../apiSlice';

const server = setupServer();

beforeAll(() => server.listen());
afterEach(() => server.resetHandlers());
afterAll(() => server.close());

describe('orderApiSlice', () => {
  test('useGetOrdersQuery', async () => {
    const mockData = [{ id: 1, name: 'Order 1' }, { id: 2, name: 'Order 2' }];
    server.use(
      rest.get(ORDERS_URL, (req, res, ctx) => {
        return res(ctx.json(mockData));
      })
    );

    const { result, waitFor } = renderHook(() =>
      orderApiSlice.useGetOrdersQuery()
    );
    await waitFor(() => result.current.isSuccess);

    expect(result.current.data).toEqual(mockData);
  });


});
