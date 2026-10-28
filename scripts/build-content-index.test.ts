import { spawnSync } from 'node:child_process'
import { existsSync } from 'node:fs'
import { homedir } from 'node:os'
import { join } from 'node:path'
import { expect, test } from 'vitest'

// The notes live only on the author's machine; elsewhere (CI) the committed files are the source.
const hasNotes = existsSync(join(homedir(), '.claude/memories/ddia-tpm-guide.md'))

test.skipIf(!hasNotes)('committed content index and sections.ts are up to date', () => {
  const r = spawnSync('node', ['scripts/build-content-index.mjs', '--check'], { encoding: 'utf8' })
  expect(r.stderr).toBe('')
  expect(r.status).toBe(0)
})
