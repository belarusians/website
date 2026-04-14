import { describe, expect, test } from '@jest/globals';
import { orderMigrationFiles } from '../../../scripts/migrate-utils';

describe('orderMigrationFiles', () => {
  test('should return empty array for empty input', () => {
    expect(orderMigrationFiles([])).toEqual([]);
  });

  test('should filter out non-migration files', () => {
    const entries = ['README.md', '.gitkeep', 'notes.txt', 'schema.sql'];
    expect(orderMigrationFiles(entries)).toEqual([]);
  });

  test('should accept valid migration filenames', () => {
    const entries = ['0001_subscriptions.sql', '0002_indexes.sql'];
    expect(orderMigrationFiles(entries)).toEqual(['0001_subscriptions.sql', '0002_indexes.sql']);
  });

  test('should sort migrations lexicographically', () => {
    const entries = ['0003_third.sql', '0001_first.sql', '0002_second.sql'];
    expect(orderMigrationFiles(entries)).toEqual(['0001_first.sql', '0002_second.sql', '0003_third.sql']);
  });

  test('should filter and sort together', () => {
    const entries = ['README.md', '0002_second.sql', '.gitkeep', '0001_first.sql', 'notes.txt'];
    expect(orderMigrationFiles(entries)).toEqual(['0001_first.sql', '0002_second.sql']);
  });

  test('should reject files without 4-digit prefix', () => {
    const entries = ['01_short.sql', '00001_long.sql', 'abc_name.sql'];
    expect(orderMigrationFiles(entries)).toEqual([]);
  });

  test('should reject files without .sql extension', () => {
    const entries = ['0001_name.ts', '0001_name.json'];
    expect(orderMigrationFiles(entries)).toEqual([]);
  });

  test('should handle single migration', () => {
    expect(orderMigrationFiles(['0001_init.sql'])).toEqual(['0001_init.sql']);
  });
});
