import { addDecimals, updateCart } from './cartUtils';
import Decimal from 'decimal.js';

describe('cartUtils', () => {
  describe('addDecimals', () => {
    it('should correctly format a number to two decimal places', () => {
      expect(addDecimals(1.2345)).toBe('1.23');
      expect(addDecimals(1.2)).toBe('1.20');
      expect(addDecimals(1)).toBe('1.00');
    });
  });

  describe('updateCart', () => {
    it('should correctly calculate the cart totals', () => {
      const state = {
        cartItems: [
          { price: 1.23, qty: 2 },
          { price: 4.56, qty: 3 },
        ],
      };

      const updatedState = updateCart(state);

      const itemsPrice = new Decimal(1.23).times(2).plus(new Decimal(4.56).times(3));
      const shippingPrice = itemsPrice.greaterThan(100) ? new Decimal(0) : new Decimal(10);
      const taxPrice = new Decimal(0.15).times(itemsPrice);
      const totalPrice = itemsPrice.plus(shippingPrice).plus(taxPrice);

      expect(updatedState.itemsPrice).toBe(addDecimals(itemsPrice));
      expect(updatedState.shippingPrice).toBe(addDecimals(shippingPrice));
      expect(updatedState.taxPrice).toBe(addDecimals(taxPrice));
      expect(updatedState.totalPrice).toBe(addDecimals(totalPrice));
    });
  });
});
