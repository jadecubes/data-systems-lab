import type { Version } from '../lessons/retryWorkshop'

export type VersionSql = { readonly api: string; readonly lines: readonly string[] }
export type OrderRetrySql = { readonly schema: readonly string[]; readonly versions: Readonly<Record<Version, VersionSql>> }

/**
 * Splits `examples/order_retry.sql` above `-- TEACHING-END` into the schema and one block per version. Comment lines
 * are dropped, except a version's `-- POST` line, which is the request the browser sends.
 */
export function parseOrderRetrySql(source: string): OrderRetrySql {
  const end = source.indexOf('-- TEACHING-END')
  if (end < 0) throw new Error('order_retry.sql has no TEACHING-END')
  let schema: string[] = []
  const versions: Partial<Record<Version, VersionSql>> = {}
  for (const block of source.slice(0, end).split(/\n\s*\n/)) {
    const lines = block.split('\n').filter((l) => l.trim())
    const code = lines.filter((l) => !l.startsWith('--'))
    const version = lines[0]?.match(/^-- version: (\w+)$/)?.[1] as Version | undefined
    if (!version) {
      if (code.length) schema = code
      continue
    }
    const api = lines.find((l) => l.startsWith('-- POST '))?.slice(3)
    if (!api) throw new Error(`version ${version} has no -- POST line`)
    versions[version] = { api, lines: code }
  }
  if (!versions.none || !versions.server || !versions.client || !schema.length) throw new Error('order_retry.sql is missing a block')
  return { schema, versions: versions as Record<Version, VersionSql> }
}
