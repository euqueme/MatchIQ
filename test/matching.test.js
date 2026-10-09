import { describe, it, expect } from 'vitest';
import { findMatches } from '../services/matching.js';

describe('findMatches', () => {
  const pool = [
    { id:1, iq:100, attr:5, age:25, dist:10 },
    { id:2, iq:105, attr:6, age:30, dist:50 },
    { id:3, iq:90, attr:4, age:40, dist:5 },
  ];

  it('finds matches within IQ ±5 and attr ±1', () => {
    const matches = findMatches(pool, 100, 5, { ageMin:18, ageMax:99, maxDist:100 });
    expect(matches.map(m=>m.id)).toEqual([1,2]);
  });
});
