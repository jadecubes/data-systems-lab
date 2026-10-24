import { describe, expect, test } from 'vitest'
import { spawnSync } from 'node:child_process'
import { mkdtempSync, writeFileSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
import { fileURLToPath } from 'node:url'
import { findBanned, parseTerms } from './banned-words.mjs'

// Neutral stand-in terms only: the real list must never appear in the repo.
const terms = parseTerms('# comment\nacme\nAcme Corp\n秘密專案\n\n')

test('parses one term per line, skipping comments and blanks', () => {
  expect(terms).toEqual(['acme', 'Acme Corp', '秘密專案'])
})

test('ASCII terms match whole words, including identifier segments, case-insensitively', () => {
  expect(findBanned('call acmeApi', terms)).toEqual(['acme'])
  expect(findBanned('acme_fe', terms)).toEqual(['acme'])
  expect(findBanned('myAcme', terms)).toEqual(['acme'])
  expect(findBanned('ACME2', terms)).toEqual(['acme'])
  expect(findBanned('ACMEApi', terms)).toEqual(['acme'])
  expect(findBanned('debra@acme.group', terms)).toEqual(['acme'])
  expect(findBanned('用acme系統', terms)).toEqual(['acme'])
  expect(findBanned('AcmeCorp', terms)).toEqual(['acme', 'Acme Corp'])
  expect(findBanned('acmes acmeco', terms)).toEqual([])
})

test('CJK terms match as plain substrings', () => {
  expect(findBanned('這是秘密專案的筆記', terms)).toEqual(['秘密專案'])
})

describe('hook CLI', () => {
  const script = fileURLToPath(new URL('banned-words.mjs', import.meta.url))
  const noreply = '1+x@users.noreply.github.com'

  function repo(files: Record<string, string>) {
    const dir = mkdtempSync(join(tmpdir(), 'banned-'))
    spawnSync('git', ['init', '-q'], { cwd: dir })
    for (const [name, text] of Object.entries(files)) writeFileSync(join(dir, name), text)
    spawnSync('git', ['add', '-A'], { cwd: dir })
    return dir
  }

  function run(cwd: string, args: string[], env: Record<string, string> = {}) {
    const list = join(mkdtempSync(join(tmpdir(), 'list-')), 'words.txt')
    writeFileSync(list, 'acme\n')
    return spawnSync('node', [script, ...args], {
      cwd,
      encoding: 'utf8',
      env: {
        ...process.env,
        BANNED_WORDS_FILE: list,
        GIT_AUTHOR_NAME: 'Test',
        GIT_COMMITTER_NAME: 'Test',
        GIT_AUTHOR_EMAIL: noreply,
        GIT_COMMITTER_EMAIL: noreply,
        ...env,
      },
    })
  }

  test('a staged file containing a banned word fails', () => {
    const r = run(repo({ 'notes.md': 'uses acmeApi' }), ['--staged'])
    expect(r.status).toBe(1)
    expect(r.stderr).toContain('notes.md')
  })

  test('a staged file path containing a banned word fails', () => {
    expect(run(repo({ 'acme-notes.md': 'clean' }), ['--staged']).status).toBe(1)
  })

  test('clean staged files pass', () => {
    expect(run(repo({ 'notes.md': 'clean' }), ['--staged']).status).toBe(0)
  })

  test('a missing list fails and says how to create it', () => {
    const r = run(repo({ 'notes.md': 'clean' }), ['--staged'], { BANNED_WORDS_FILE: '/nonexistent/words.txt' })
    expect(r.status).toBe(1)
    expect(r.stderr).toContain('/nonexistent/words.txt')
  })

  test('a non-noreply author email fails', () => {
    const r = run(repo({ 'notes.md': 'clean' }), ['--staged'], { GIT_AUTHOR_EMAIL: 'x@example.com' })
    expect(r.status).toBe(1)
    expect(r.stderr).toContain('users.noreply.github.com')
  })

  test('commit messages are checked', () => {
    const dir = repo({})
    writeFileSync(join(dir, 'bad'), 'fix ACME bug')
    writeFileSync(join(dir, 'good'), 'fix bug')
    expect(run(dir, ['--message', 'bad']).status).toBe(1)
    expect(run(dir, ['--message', 'good']).status).toBe(0)
  })
})
