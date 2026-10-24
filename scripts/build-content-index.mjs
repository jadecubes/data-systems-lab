// Builds docs/content-index.md: every section of the DDIA notes, mapped to where the site plan puts it.
// Usage: node scripts/build-content-index.mjs [--check]
//   --check: write nothing; exit 1 if the committed index differs from a fresh build.
import { readFileSync, writeFileSync } from 'node:fs'
import { homedir } from 'node:os'
import { join } from 'node:path'

const memories = join(homedir(), '.claude/memories')
const notes = readFileSync(join(memories, 'designing-data-intensive-applications.md'), 'utf8').split('\n')
const guide = readFileSync(join(memories, 'ddia-tpm-guide.md'), 'utf8').split('\n')

// Notes cite PDF pages; the printed book page is 24 lower (notes header).
const printed = (pages) => pages.replace(/\d+/g, (n) => String(Number(n) - 24))

// 1. Note sections: every heading of level 3–5 inside a chapter, with its own line range.
const sections = []
let chapter = 0
notes.forEach((line, i) => {
  const ch = line.match(/^## 第 (\d+) 章 /)
  if (ch) { chapter = Number(ch[1]); return }
  if (/^## /.test(line)) { chapter = 0; return }
  const h = line.match(/^(#{3,5}) (.*)$/)
  if (h && chapter) sections.push({ line: i + 1, level: h[1].length, title: h[2], chapter })
})
sections.forEach((s, i) => { s.end = (sections[i + 1]?.line ?? notes.length + 1) - 1 })

// 2. Guide entries: topic sections (bold lines under "### T…/Q…") and one-liners (under "## 其餘"),
//    each naming a chapter and a notes heading.
const entries = []
const entryLines = []
let conclusions = 0
let topic = null
let inOneLiners = false
for (const line of guide) {
  const t = line.match(/^### ([TQ]\d+) /)
  if (t) { topic = t[1]; inOneLiners = false; continue }
  if (/^## /.test(line)) { topic = null; inOneLiners = /^## 其餘/.test(line); continue }
  if (topic && line.startsWith('- 結論：')) conclusions++
  if (!(topic || inOneLiners) || !/^(\*\*|- )第 \d+ 章 /.test(line)) continue
  entryLines.push(line)
  const head = line.match(/^(?:\*\*|- )第 (\d+) 章 (.+?)(?:\*\*（|（第 ?\d+-\d+ ?行)/)
  if (!head) continue
  entries.push({
    kind: topic ? 'topic' : 'oneLiner',
    topic,
    chapter: Number(head[1]),
    title: head[2],
    pages: line.match(/p\.([\d–\-]+(?:, p\.[\d–\-]+)*)/)?.[1]?.replaceAll(', p.', ', ') ?? '',
    product: line.match(/產品：(要會用|要能問|懂名詞|跳過)/)?.[1] ?? '',
    platform: line.match(/平台：(要會用|要能問|懂名詞|跳過)/)?.[1] ?? '',
  })
}

// 3. Match each entry to exactly one note section by chapter + heading. Any line that does not
//    parse or match fails the run: a silent miss would let the coverage check pass on wrong data.
const problems = []
if (entryLines.length !== entries.length) problems.push(`篩選版有 ${entryLines.length} 行條目，只解析出 ${entries.length} 筆`)
// Every topic section has exactly one "結論" line; a mismatch means a section heading line was missed.
const topicEntries = entries.filter((e) => e.kind === 'topic').length
if (conclusions !== topicEntries) problems.push(`篩選版主題段落有 ${conclusions} 行結論，但只認出 ${topicEntries} 個段落標題`)
for (const e of entries) {
  const found = sections.filter((s) => s.chapter === e.chapter && s.title === e.title)
  if (found.length !== 1) problems.push(`${found.length ? '重複' : '找不到'}：第 ${e.chapter} 章 ${e.title}`)
  e.section = found[0]
}
// One section belongs to one topic page; two topic entries on it would drop it from one of them.
for (const s of sections) {
  const owners = entries.filter((e) => e.section === s && e.kind === 'topic').map((e) => e.topic)
  if (owners.length > 1) problems.push(`同一段被多個主題收錄（${owners.join('、')}）：第 ${s.chapter} 章 ${s.title}`)
}
if (problems.length) {
  console.error(problems.join('\n'))
  process.exit(1)
}
for (const s of sections) {
  const mine = entries.filter((e) => e.section === s)
  s.topics = mine.filter((e) => e.kind === 'topic').map((e) => e.topic)
  s.entry = mine.find((e) => e.kind === 'topic') ?? mine[0]
}
const destination = (s) =>
  s.topics.length ? s.topics.map((t) => `${t} 主題頁`).join('；') : s.entry ? '一行版（這版不做）' : '不收（懂名詞／跳過）'

// 4. Render.
const count = (pred) => sections.filter(pred).length
const covered = count((s) => s.topics.length)
const out = [
  '# DDIA 內容索引：每段筆記放到網站哪裡',
  '',
  '> 由 `scripts/build-content-index.mjs` 從 `~/.claude/memories/designing-data-intensive-applications.md`（筆記）與 `ddia-tpm-guide.md`（PM 篩選版）產生，不要手改；筆記或篩選版改了就重跑。',
  '> 設計依據：`docs/2026-10-24-site-design.md`。用途：核對網站是否把計畫收錄的每一段都做成頁面。',
  '',
  '## 怎麼用這份索引',
  '',
  '- 「去處」寫主題頁的段落，網站上必須找得到。有沒有漏由測試核對（設計稿第 9.2 節），不在這裡打勾。',
  '- 篩選版每筆條目用「章＋標題」對到筆記的一個段落；對不上、重複或解析不出來，產生器就失敗。',
  '- 評級是篩選版的判斷（模型依筆記評，未經 PM 實務驗證）。「不收」的段落篩選版沒有逐段列出評級，評級欄空白。',
  '- 章末的「名詞」「怎麼選」「容易誤解」「小結」也是段落，照樣列出。',
  `- 篩選版開頭寫評了 416 段，筆記各章實際有 ${sections.length} 個標題，以本索引為準。`,
  '- 「PDF 頁」對照筆記用；「印刷頁」＝PDF 頁 − 24，是書上印的、網站上顯示的頁碼。',
  '',
  '## 總覽',
  '',
  '| 項目 | 段數 |',
  '|---|---|',
  `| 筆記段落（各章 ###–##### 標題） | ${sections.length} |`,
  `| 收進主題頁（第一、二線） | ${covered} |`,
  `| 　其中第一線 T | ${count((s) => s.topics.some((t) => t.startsWith('T')))} |`,
  `| 　其中第二線 Q | ${count((s) => s.topics.some((t) => t.startsWith('Q')))} |`,
  `| 一行版（這版不做） | ${count((s) => !s.topics.length && s.entry)} |`,
  `| 不收（懂名詞／跳過） | ${count((s) => !s.entry)} |`,
  '',
  '## 依主題：每頁必須涵蓋的段落',
  '',
]
for (const id of [...new Set(entries.filter((e) => e.topic).map((e) => e.topic))]) {
  // Drop the guide's personal study-progress note (e.g. "已上過，只複習："); it is not site content.
  out.push(guide.find((l) => l.startsWith(`### ${id} `)).replace(/已上過，只複習：/, ''), '')
  out.push('| 筆記行 | 章 | 段落 | PDF 頁 | 印刷頁 | 產品 | 平台 |', '|---|---|---|---|---|---|---|')
  for (const e of entries.filter((x) => x.topic === id)) {
    const s = e.section
    out.push(`| ${s.line}-${s.end} | ${s.chapter} | ${s.title} | ${e.pages} | ${printed(e.pages)} | ${e.product} | ${e.platform} |`)
  }
  out.push('')
}
out.push('## 依章節：全書每一段的去處', '')
let current = 0
for (const s of sections) {
  if (s.chapter !== current) {
    current = s.chapter
    out.push('', notes.find((l) => l.startsWith(`## 第 ${current} 章 `)).replace(/^## /, '### '), '')
    out.push('| 筆記行 | 段落 | 產品 | 平台 | 去處 |', '|---|---|---|---|---|')
  }
  const indent = '　'.repeat(s.level - 3)
  out.push(`| ${s.line}-${s.end} | ${indent}${s.title} | ${s.entry?.product ?? ''} | ${s.entry?.platform ?? ''} | ${destination(s)} |`)
}
out.push('')

const target = new URL('../docs/content-index.md', import.meta.url)
if (process.argv.includes('--check')) {
  if (readFileSync(target, 'utf8') !== out.join('\n')) {
    console.error('docs/content-index.md 過期：重跑 node scripts/build-content-index.mjs')
    process.exit(1)
  }
} else {
  writeFileSync(target, out.join('\n'))
}
console.log(`sections=${sections.length} covered=${covered} entries=${entries.length}`)
