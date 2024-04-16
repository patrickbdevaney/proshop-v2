import { configureStore } from '@reduxjs/toolkit';
import { apiSlice, baseQueryWithAuth } from './apiSlice';
import { logout } from './authSlice';

describe('apiSlice', () => {
  let store;
  const initialState = {
    endpoints: {},
    tagTypes: ['Product', 'Order', 'User'],
  };

  beforeEach(() => {
    store = configureStore({
      reducer: {
        api: apiSlice.reducer,
      },
    });
  });

  test('should handle initial state', () => {
    expect(store.getState().api).toEqual(initialState);
  });

  test('baseQueryWithAuth should handle 401 error', async () => {
    const args = { url: '/test' };
    const api = { dispatch: jest.fn() };
    const extra = {};
    global.fetch = jest.fn(() =>
      Promise.resolve({
        ok: false,
        status: 401,
        json: () => Promise.resolve({ message: 'Unauthorized' }),
      })
    );

    const result = await baseQueryWithAuth(args, api, extra);

    expect(result.error.status).toBe(401);
    expect(api.dispatch).toHaveBeenCalledWith(logout());
  });

});
