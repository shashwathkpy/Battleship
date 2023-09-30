const ship = require('./ship.js');

const cruiser = new ship(3);
cruiser.hit();

test('Testing Ship Object', () => {
    expect(cruiser.isSunk()).toBe(true);
  });