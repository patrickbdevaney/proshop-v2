import { configureStore } from '@reduxjs/toolkit';
import authReducer, {
  setCredentials,
  logout,
} from './authSlice';

describe('authSlice', () => {
  let store;
  const initialState = {
    userInfo: null,
  };

  beforeEach(() => {
    store = configureStore({
      reducer: {
        auth: authReducer,
      },
    });
    // Clear localStorage
    localStorage.clear();
  });

  test('should handle initial state', () => {
    expect(store.getState().auth).toEqual(initialState);
  });

  test('should handle setCredentials', () => {
    const userInfo = { id: '1', name: 'User 1' };
    store.dispatch(setCredentials(userInfo));
    expect(store.getState().auth.userInfo).toEqual(userInfo);
    expect(JSON.parse(localStorage.getItem('userInfo'))).toEqual(userInfo);
  });

  test('should handle logout', () => {
    store.dispatch(logout());
    expect(store.getState().auth.userInfo).toBeNull();
    expect(localStorage.getItem('userInfo')).toBeNull();
  });


});
