// @vitest-environment node
import { readFileSync } from 'node:fs'
import type { DatabaseSync as Database } from 'node:sqlite'
import { expect, test } from 'vitest'
import { parseOrderRetrySql } from '../content/orderRetrySql'
import { CLIENT_REQUEST_ID, ORDER_AMOUNT, type Version } from './retryWorkshop'

// The SQL the lab shows is run for real here; only the network is simulated.
const source = readFileSync(new URL('../../examples/order_retry.sql', import.meta.url), 'utf8')
const sql = parseOrderRetrySql(source)
// vitest cannot load `import 'node:sqlite'`; the builtin loader can.
const { DatabaseSync } = process.getBuiltinModule('node:sqlite') as typeof import('node:sqlite')

const statements = (lines: readonly string[]) =>
  lines.join('\n').split(';').map((s) => s.trim()).filter(Boolean)

// node:sqlite rejects named parameters a statement does not use.
const pick = (statement: string, params: Record<string, string | number>) =>
  Object.fromEntries(Object.entries(params).filter(([k]) => statement.includes(`:${k}`)))

/** A server running one version's SQL; `handle` is its handling of one POST /orders. */
function server(version: Version) {
  const db: Database = new DatabaseSync(':memory:')
  db.exec(sql.schema.join('\n'))
  const all = statements(sql.versions[version].lines)
  // The browser-made version ends with the lookup it runs when the request ID is already recorded.
  const lookup = version === 'client' ? all.pop()! : null
  let made = 0
  const count = (table: string) => (db.prepare(`SELECT COUNT(*) AS n FROM ${table}`).get() as { n: number }).n
  return {
    count,
    handle(): number {
      const params = { amount: ORDER_AMOUNT, request_id: CLIENT_REQUEST_ID, server_request_id: `s-${++made}` }
      try {
        let id = 0
        for (const s of all) id = Number(db.prepare(s).run(pick(s, params)).lastInsertRowid) || id
        if (!lookup) return id
      } catch (e) {
        // A repeated request ID breaks the uniqueness constraint, and the whole transaction is undone.
        expect((e as Error).message).toMatch(/UNIQUE constraint failed: requests\.request_id/)
        db.exec('ROLLBACK')
      }
      return (db.prepare(lookup!).get(pick(lookup!, params)) as { order_id: number }).order_id
    },
  }
}

test('without a request ID, the same request handled twice makes two orders', () => {
  const s = server('none')
  expect(s.handle()).not.toBe(s.handle())
  expect(s.count('orders')).toBe(2)
})

test('an ID the server makes when a request arrives is new each time, so it stops nothing: two orders', () => {
  const s = server('server')
  s.handle()
  s.handle()
  expect(s.count('orders')).toBe(2)
  expect(s.count('requests')).toBe(2)
})

test('a request ID the browser makes before the first send stops the second: one order, and the resend gets the first one back', () => {
  const s = server('client')
  const first = s.handle()
  expect(s.handle()).toBe(first)
  expect(s.count('orders')).toBe(1)
  expect(s.count('requests')).toBe(1)
})

test('each version shows the API request it receives; the browser-made ID is the one the model uses', () => {
  expect(sql.versions.none.api).toMatch(/^POST \/orders /)
  expect(sql.versions.server.api).toBe(sql.versions.none.api)
  expect(sql.versions.client.api).toContain(`"request_id": "${CLIENT_REQUEST_ID}"`)
  for (const v of Object.values(sql.versions)) for (const line of v.lines) expect(line).not.toContain('--')
})
