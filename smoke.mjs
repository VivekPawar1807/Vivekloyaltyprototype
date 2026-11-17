import assert from 'node:assert/strict';

function calculate({ amount, spend, multiplier, cap }) {
  const base = Math.floor(amount / 100) * 10;
  const raw = base * multiplier;
  const points = Math.min(raw, cap);
  const updated = spend + amount;
  const tier = updated >= 150000 ? 'Platinum' : updated >= 50000 ? 'Gold' : 'Silver';
  return { base, raw, points, updated, tier };
}

function criticalValidation({ resolved, multiplier, cap }) {
  return (resolved ? 0 : 1) + (multiplier > 0 ? 0 : 1) + (cap > 0 ? 0 : 1);
}

const normal = calculate({ amount: 2000, spend: 149000, multiplier: 1.5, cap: 5000 });
assert.equal(normal.base, 200);
assert.equal(normal.raw, 300);
assert.equal(normal.points, 300);
assert.equal(normal.updated, 151000);
assert.equal(normal.tier, 'Platinum');

const revision = calculate({ amount: 2000, spend: 149000, multiplier: 2, cap: 5000 });
assert.equal(revision.points, 400);

const capped = calculate({ amount: 500000, spend: 50000, multiplier: 2, cap: 5000 });
assert.equal(capped.raw, 100000);
assert.equal(capped.points, 5000);

assert.equal(criticalValidation({ resolved: false, multiplier: 1.5, cap: 5000 }), 1);
assert.equal(criticalValidation({ resolved: true, multiplier: 2, cap: 5000 }), 0);
assert.equal(criticalValidation({ resolved: true, multiplier: 0, cap: 0 }), 2);

const revenue = 0.85 + 1.73;
assert.equal(Number(revenue.toFixed(2)), 2.58);
assert.equal(Number((2.58 - 0.95 - 1.63).toFixed(2)), 0);

console.log('10 deterministic smoke assertions passed');
