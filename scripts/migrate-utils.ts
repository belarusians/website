const MIGRATION_PATTERN = /^\d{4}_.*\.sql$/;

export function orderMigrationFiles(entries: string[]): string[] {
  return entries.filter((e) => MIGRATION_PATTERN.test(e)).sort();
}
