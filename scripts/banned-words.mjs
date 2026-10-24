// Blocks commits that contain a banned word (work names that must never reach this public repo).
// The list lives outside the repo, because the list itself must not be published.
// Usage (from .githooks): node scripts/banned-words.mjs --staged | --message <file>
import { execFileSync } from 'node:child_process'
import { existsSync, readFileSync } from 'node:fs'
import { homedir } from 'node:os'
import { join } from 'node:path'
import { fileURLToPath } from 'node:url'

export function parseTerms(text) {
  return text.split('\n').map((l) => l.trim()).filter((l) => l && !l.startsWith('#'))
}

// Identifier-aware words: "acmeApi", "ACMEApi", "acme_fe", "acme2" all contain the word "acme".
function words(text) {
  return text
    .split(/[^A-Za-z0-9]+/)
    .flatMap((chunk) => chunk.split(/(?<=[a-z])(?=[A-Z])|(?<=[A-Z])(?=[A-Z][a-z])|(?<=[A-Za-z])(?=\d)|(?<=\d)(?=[A-Za-z])/))
    .filter(Boolean)
    .map((w) => w.toLowerCase())
}

function contains(haystack, needle) {
  return haystack.some((_, i) => needle.every((w, j) => haystack[i + j] === w))
}

export function findBanned(text, terms) {
  const textWords = words(text)
  const lower = text.toLowerCase()
  // `\b` never matches around CJK characters, so non-ASCII terms are plain substrings.
  return terms.filter((t) => (/^[\x00-\x7f]*$/.test(t) ? contains(textWords, words(t)) : lower.includes(t.toLowerCase())))
}

function git(...args) {
  return execFileSync('git', args, { encoding: 'utf8' })
}

function main(args) {
  const listPath = process.env.BANNED_WORDS_FILE ?? join(homedir(), '.claude/memories/data-systems-lab-banned-words.txt')
  if (!existsSync(listPath)) {
    console.error(`Banned-word list not found: ${listPath}\nCreate it first: one term per line, # for comments.`)
    return 1
  }
  const terms = parseTerms(readFileSync(listPath, 'utf8'))
  const problems = []
  const check = (where, text) => {
    const hits = findBanned(text, terms)
    if (hits.length) problems.push(`${where}: ${hits.join(', ')}`)
  }
  if (args[0] === '--message') {
    check('commit message', readFileSync(args[1], 'utf8'))
  } else if (args[0] === '--staged') {
    for (const name of ['GIT_AUTHOR_IDENT', 'GIT_COMMITTER_IDENT']) {
      const ident = git('var', name)
      check(name, ident)
      // Checked even if the list misses a work domain: the global git email is a work address.
      if (!/@users\.noreply\.github\.com>/.test(ident)) {
        problems.push(`${name} must use a GitHub users.noreply.github.com email (git config user.email …)`)
      }
    }
    for (const path of git('diff', '--cached', '--name-only', '-z', '--diff-filter=ACMR').split('\0').filter(Boolean)) {
      check(`${path} (path)`, path)
      check(path, git('show', `:${path}`))
    }
  } else {
    console.error('Usage: banned-words.mjs --staged | --message <file>')
    return 2
  }
  if (problems.length) console.error(`Commit blocked, banned words found:\n${problems.join('\n')}`)
  return problems.length ? 1 : 0
}

if (process.argv[1] === fileURLToPath(import.meta.url)) process.exit(main(process.argv.slice(2)))
