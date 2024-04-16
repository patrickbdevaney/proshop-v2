import { render, fireEvent, waitFor } from '@testing-library/react';
import { Provider } from 'react-redux';
import { store } from '../app/store';
import LoginScreen from '../screens/LoginScreen';

test('login form submits correctly', async () => {
  const mockLogin = jest.fn();
  mockLogin.mockResolvedValueOnce({
    email: 'test@example.com',
    password: 'password',
  });

  const { getByLabelText, getByRole } = render(
    <Provider store={store}>
      <LoginScreen login={mockLogin} />
    </Provider>
  );

  fireEvent.input(getByLabelText(/email/i), {
    target: { value: 'test@example.com' },
  });
  fireEvent.input(getByLabelText(/password/i), {
    target: { value: 'password' },
  });

  fireEvent.click(getByRole('button', { name: /sign in/i }));

  await waitFor(() =>
    expect(mockLogin).toHaveBeenCalledWith({
      email: 'test@example.com',
      password: 'password',
    })
  );
});
