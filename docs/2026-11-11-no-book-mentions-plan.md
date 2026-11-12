# 畫面上的文字不再提「書中」實作計畫

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking. The repository's `AGENTS.md` governs verification and forbids commits until Debra explicitly asks for one; every "Commit" step below waits for that.

**Goal:** 畫面上的文字不再用「書中」／“The book”轉述書：網站是我們重新詮釋的內容，對書的致謝只在地圖頁出現一次。

**Architecture:** 只改內容字串與檢查它們的測試；不改元件。

**Tech Stack:** vitest。

**Spec:** `docs/2026-10-24-site-design.md` §3 與 §5.2（例子那條在這裡改掉）。

## Global Constraints

- 先寫 zh-TW 再寫 en，同一次改動；英文用術語表的詞。
- 不改例子的內容與數字；`source` 標記不動。
- `pnpm test && pnpm build && pnpm test:e2e` 結束時全綠。
- 一隻獨立的 PR，和心智圖的 PR（`docs/2026-11-09-mind-maps-plan.md`）無關，先做或後做都可以；兩隻改同樣的主題檔，後合併的那隻要 rebase。

## 決定（Debra 2026-11-09）

- 例子不再以「書中」／“The book”開頭，句中也不提書；設計稿 §3 與 §5.2「書中例子以『書中』開頭」那條改掉。

## 我做的決定（請檢查）

- 改寫後，讀者分不出哪些例子取自書、哪些是我們舉的（`ours`，共 8 個）；整個網站都是我們的詮釋，所以接受。`source` 標記留在資料裡，不顯示。
- 引述研究或數字的例子改成「一項研究發現……」這類寫法，不提書，但仍看得出是研究結果。
- D1 實驗課「真實案例」那一列的標籤「書中例子」／“In the book”改成「經典例子」／“Classic examples”，和旁邊的「公開做法」「常見模式」並列。

## Review Focus

- 拿掉「書中」後，原本轉述書的說法可能變成網站自己的斷言，或意思被改掉 → Step 4 把每一處改寫列成中英對照清單請 Debra 看過。

---

### Task 1: 改寫所有提到書的字串

**Files:**
- Modify: 所有主題的 `src/content/{zh-TW,en}/topics/*.ts`、`src/content/{zh-TW,en}/labs/d1.ts`（約 93 個中文例子、約 100 處英文，加上句中與實驗課的幾處）、`docs/2026-10-24-site-design.md`（§3「文字」那條與 §5.2 例子那條，兩處說同一件事）、`docs/2026-11-05-phase-4-plan.md`（Global Constraints 裡「書中例子以『書中』開頭」那條）、`AGENTS.md` 與 `CLAUDE.md`（Content and languages 加一條）
- Test: `src/content/content.test.ts`

- [ ] **Step 1: 改測試，讓它失敗**：現有的 `every book example opens by naming the book, no example of ours does, and none cites a page` 改成 `no on-screen topic or lab text mentions the book`：走過兩種語言的所有主題與實驗課字串，中文不能符合 `/書中|書裡|本書|原書|這本書/`，英文不能符合 `/\bthe book\b/i`。頁碼另有 `no page numbers in content` 檢查。`ui` 的字串（地圖頁的致謝與介紹）不在檢查範圍。
- [ ] **Step 2:** `pnpm vitest run src/content/content.test.ts`，預期 FAIL，列出所有提到書的字串。
- [ ] **Step 3:** 逐句改寫，zh-TW 先、en 後：拿掉開頭的「書中說／書中的／書中提到」，讓句子自己成立（「書中的付款流程：先呼叫……」→「付款流程：先呼叫……」）；引述研究或數字的寫成「一項研究發現……」；D1 的標籤照「我做的決定」。
- [ ] **Step 4:** `pnpm test && pnpm build && pnpm test:e2e` 全綠；每一處改寫列成中英對照清單（改前、改後）請 Debra 看過，特別是原本「書中說……」的斷言。
- [ ] **Step 5: Commit**（等 Debra 說 commit）
