import { describe, expect, it } from '@jest/globals';
import { COLORS, PRIMARY } from '../tokens';

describe('theme tokens', () => {
  const expectedKeys = [
    'black',
    'blackTint',
    'blueUkraine',
    'grey',
    'kingOrange',
    'kingOrangeShade',
    'kingOrangeTint',
    'lightGrey',
    'nlBlue',
    'nlRed',
    'red',
    'redShade',
    'redTint',
    'white',
    'whiteShade',
    'yellowUkraine',
  ];

  it('exposes every expected key', () => {
    expect(Object.keys(COLORS).sort()).toEqual(expectedKeys);
  });

  it('every value is a valid hex or rgb() string', () => {
    const shape = /^#[0-9a-fA-F]{6,8}$|^rgb\(/;
    for (const [key, value] of Object.entries(COLORS)) {
      expect(value).toMatch(shape);
      expect(typeof value).toBe('string');
      // sanity: ensure key is exposed
      expect(key.length).toBeGreaterThan(0);
    }
  });

  it('PRIMARY aliases COLORS.red', () => {
    expect(PRIMARY).toBe(COLORS.red);
  });
});
