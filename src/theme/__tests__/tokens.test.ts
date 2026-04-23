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
    const shape = /^#(?:[0-9a-fA-F]{6}|[0-9a-fA-F]{8})$|^rgb\(\s*\d{1,3}\s*,\s*\d{1,3}\s*,\s*\d{1,3}\s*\)$/;
    for (const value of Object.values(COLORS)) {
      expect(value).toMatch(shape);
    }
  });

  it('PRIMARY aliases COLORS.red', () => {
    expect(PRIMARY).toBe(COLORS.red);
  });
});
