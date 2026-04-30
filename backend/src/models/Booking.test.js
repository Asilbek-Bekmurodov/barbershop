const test = require('node:test');
const assert = require('node:assert/strict');
const Booking = require('./Booking');

test('Booking status enum includes the full lifecycle', () => {
  const statusPath = Booking.schema.path('status');

  assert.deepEqual(statusPath.enumValues.sort(), [
    'cancelled',
    'completed',
    'confirmed',
    'in_progress',
    'pending',
  ]);
});

test('Booking has a unique active slot index', () => {
  const indexes = Booking.schema.indexes();
  const activeSlotIndex = indexes.find(([fields, options]) => {
    const activeStatuses = options.partialFilterExpression?.status?.$in || [];

    return (
      fields.barberId === 1 &&
      fields.startTime === 1 &&
      options.unique === true &&
      activeStatuses.includes('pending') &&
      activeStatuses.includes('confirmed') &&
      activeStatuses.includes('in_progress')
    );
  });

  assert.ok(activeSlotIndex);
});
