import Decimal from 'decimal.js';

//we improved decimal precision with the decimal.js library, rather than multiplying and dividing by 100

export const addDecimals = (num) => {
  return new Decimal(num).toFixed(2);
};

const calculateItemsPrice = (cartItems) => {
  return cartItems.reduce(
    (acc, item) => acc.plus(new Decimal(item.price).times(item.qty)),
    new Decimal(0)
  );
};

const calculateShippingPrice = (itemsPrice) => {
  return itemsPrice.greaterThan(100) ? new Decimal(0) : new Decimal(10);
};

const calculateTaxPrice = (itemsPrice) => {
  return new Decimal(0.15).times(itemsPrice);
};

const calculateTotalPrice = (itemsPrice, shippingPrice, taxPrice) => {
  return itemsPrice.plus(shippingPrice).plus(taxPrice);
};

export const updateCart = (state) => {
  const itemsPrice = calculateItemsPrice(state.cartItems);
  state.itemsPrice = addDecimals(itemsPrice);

  const shippingPrice = calculateShippingPrice(itemsPrice);
  state.shippingPrice = addDecimals(shippingPrice);

  const taxPrice = calculateTaxPrice(itemsPrice);
  state.taxPrice = addDecimals(taxPrice);

  const totalPrice = calculateTotalPrice(itemsPrice, shippingPrice, taxPrice);
  state.totalPrice = addDecimals(totalPrice);

  localStorage.setItem('cart', JSON.stringify(state));

  return state;
};
