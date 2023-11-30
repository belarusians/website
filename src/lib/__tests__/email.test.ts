import { describe, expect, test } from '@jest/globals';
import { isEmailValid } from '../email';

describe('isEmailValid', () => {
  test('should return false for empty parameter', () => {
    expect(isEmailValid()).toBe(false);
  });

  test('should return false for invalid email', () => {
    expect(isEmailValid('test')).toBe(false);
  });

  test('should return true for valid email', () => {
    expect(isEmailValid('fake@gmail.com')).toBe(true);
  });
});
