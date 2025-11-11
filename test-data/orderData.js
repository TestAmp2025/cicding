export const orderPayload = {
    customer: {
      firstName: 'Testa',
      lastName: 'Rossa',
      email: 'testa.rossa@yopmail.com',
    },
    items: [
      { productId: 1, quantity: 2 },
      { productId: 3, quantity: 1 },
    ],
    payment: {
      cardNo: '4242424242424242',
      expiry: '10/26',
      ccv: '200',
    },
  };
  