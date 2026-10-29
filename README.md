# data-systems-lab

A bilingual (Traditional Chinese / English) study site for people moving into technical project management.
It maps which parts of *Designing Data-Intensive Applications* (2nd edition) a technical project manager needs, and
for each topic gives the conclusion, the trade-off, the questions to ask engineers, and an example.
Hands-on labs (timeouts and retries, replication lag, concurrent edits) follow in later phases.

The text is written in our own words; page numbers point to the printed book.

## Setup

Requires Node 22.13 or later and pnpm.

```bash
pnpm install
git config core.hooksPath .githooks
git config user.email "<id>+<login>@users.noreply.github.com"
```

The hooks block any commit whose content, file names, message or author contains a banned word, and any
commit not authored with a GitHub noreply email. The banned-word list lives outside the repo at
`~/.claude/memories/data-systems-lab-banned-words.txt` (one term per line, `#` for comments); commits are
blocked until it exists.

## Commands

| Command | What it does |
| --- | --- |
| `pnpm dev` | Development server |
| `pnpm test` | Unit and component tests (vitest) |
| `pnpm build` | Typecheck, build, and prerender every live page into `dist/` |
| `pnpm test:e2e` | Build under `/data-systems-lab/` and run the Playwright link crawl, language and 404 checks |
| `pnpm content` | Regenerate `docs/content-index.md` and `src/content/sections.ts` from the study notes (author's machine only) |

Set `BASE_PATH` (for example `BASE_PATH=/data-systems-lab/ pnpm build`) to deploy under a sub-path.

## Docs

- `docs/2026-10-24-site-design.md`: site design
- `docs/2026-10-24-phase-1-plan.md`: phase 1 implementation plan
- `docs/2026-10-28-phase-2-plan.md`: phase 2 topic-page implementation plan
- `docs/2026-10-24-d1-timeout-retry-design.md`: first lab design
- `docs/content-index.md`: where every section of the notes goes (generated)
- `docs/glossary.md`: terms in both languages, for writers
