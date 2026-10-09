import { describe, it, expect } from 'vitest';
import { iqQuestions } from '../services/iq.js';

describe('iqQuestions', () => {
  it('has 5 questions', () => {
    expect(iqQuestions.length).toBe(5);
  });
});
