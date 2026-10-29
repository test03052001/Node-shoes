const test = require('node:test');
const assert = require('node:assert/strict');
const { validationResult } = require('express-validator');
const { createOrderRules } = require('../src/validators/orderValidators');

async function validate(body) {
  const req = { body, method: 'POST', originalUrl: '/api/orders' };
  for (const rule of createOrderRules) {
    await rule.run(req);
  }
  return validationResult(req);
}

const validOrder = {
  customer: { email: 'buyer@example.com', full_name: 'John Doe' },
  shipping_address: '123 Main St',
  items: [{ shoe_id: 1, quantity: 1 }],
};

test('rejects orders without customer email', async () => {
  const { customer, ...rest } = validOrder;
  const result = await validate({ ...rest, customer: { full_name: 'John Doe' } });
  assert.equal(result.isEmpty(), false);
  assert.match(result.array()[0].msg, /email/i);
});

test('rejects orders with null customer email', async () => {
  const result = await validate({
    ...validOrder,
    customer: { ...validOrder.customer, email: null },
  });
  assert.equal(result.isEmpty(), false);
});

test('accepts orders with valid customer email', async () => {
  const result = await validate(validOrder);
  assert.equal(result.isEmpty(), true);
});
