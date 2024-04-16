import { configureStore } from '@reduxjs/toolkit';
import cartReducer, {
  addToCart,
  removeFromCart,
  saveShippingAddress,
  savePaymentMethod,
  clearCartItems,
  resetCart,
} from '../cartSlice';

describe('cartSlice', () => {
  let store;
  const initialState = {
    cartItems: [],
    shippingAddress: {},
    paymentMethod: 'PayPal',
  };

  beforeEach(() => {
    store = configureStore({
      reducer: {
        cart: cartReducer,
      },
    });
  });

  test('should handle initial state', () => {
    expect(store.getState().cart).toEqual(initialState);
  });

  test('should handle addToCart', () => {
    const item = { _id: '1', name: 'Item 1', price: 100, qty: 1 };
    store.dispactch(addToCart(item));
    expect(store.getState().cart.cartItems).toEqual([item]);
  });

 
});
