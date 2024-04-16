import { render, fireEvent, waitFor } from '@testing-library/react';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import userEvent from '@testing-library/user-event';
import LoginScreen from '../screens/LoginScreen';
import { userApiSlice } from '../slices/userApiSlice';

jest.mock('../slices/userApiSlice');

describe('LoginScreen', () => {
  let store;

  beforeEach(() => {
    store = configureStore({ reducer: { user: userApiSlice.reducer } });
    userApiSlice.endpoints.login.useMutation.mockReturnValue([jest.fn(), {}]);
  });

  it('should dispatch login when form is submitted', async () => {
    const login = jest.fn();
    userApiSlice.endpoints.login.useMutation.mockReturnValue([login, {}]);

    const { getByLabelText, getByRole } = render(
      <Provider store={store}>
        <LoginScreen />
      </Provider>
    );

    userEvent.type(getByLabelText(/username/i), 'test');
    userEvent.type(getByLabelText(/password/i), 'password');
    userEvent.click(getByRole('button', { name: /sign in/i }));

    await waitFor(() =>
      expect(login).toHaveBeenCalledWith({ username: 'test', password: 'password' })
    );
  });
});
