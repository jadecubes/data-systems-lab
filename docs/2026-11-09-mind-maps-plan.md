# 主題頁心智圖實作計畫

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking. The repository's `AGENTS.md` governs verification and forbids commits until Debra explicitly asks for one; every "Commit" step below waits for that.

**Goal:** 在適合的 20 個主題頁，用心智圖取代「本頁段落」清單：一眼看到主題的結構，滑鼠或鍵盤停在段落節點上，圖下方顯示該段結論，點了跳到該段。另外，畫面上的文字不再用「書中」／“The book”轉述書（Task 5）。

**Architecture:** 每段的內容檔多一個選填欄位 `map`，只寫該段下面的分支；第一層（各段）由段落標題自動產生。`TopicMap` 先輸出同一份大綱的巢狀清單，用 CSS 畫成往下長的樹狀圖（預先產生的 HTML、手機、平板、沒有 JavaScript 都看這份）；在有滑鼠的寬螢幕上，再載入 Markmap 把它畫成往右長的心智圖。兩者每一段的顏色相同。

**Tech Stack:** React 18、Vite 5、vitest、Playwright；新增 `markmap-view@0.18.12`、`markmap-common@0.18.9`（精確版本，只在有圖的頁面動態載入）。

**Spec:** `docs/2026-10-24-site-design.md`（Task 4 在 §5.2 加入心智圖）。盤點（每段的適合度與大綱，Debra 機器上的工作檔，不進 repo）：`/private/tmp/claude-501/-Users-d-github-data-systems-lab/08b10165-172a-473d-aa6b-c7204376ac9b/scratchpad/mindmap-survey-{T,Q}.md`；執行時若已不存在，依「決定」裡的規則從各段結論重寫。

## Global Constraints

- 元件裡沒有文字；所有字串從 `src/content/<lang>/` 經 `Content` 物件來。
- 先寫 zh-TW 再寫 en，同一次改動；英文用術語表的詞；英文檔不能有中文。
- 內部連結是以 base 開頭、以 `/` 結尾的絕對路徑；段落連結是 `<主題路徑>#<段落 id>`。
- 分支只用結論裡已經寫出的東西；Task 1–4 不改任何結論、取捨、問題、例子的文字（例子的改寫只在 Task 5）。
- 取捨不拆：選項節點只寫名稱（「最後寫入者勝」），不寫代價或評語。
- 畫面上的文字不用「書中」「書裡」「The book」「In the book」轉述書：網站是我們重新詮釋的內容，對書的致謝只在地圖頁出現一次。新寫的文字（分支標籤、面板提示）從一開始就照這條。
- 375px 與 200% 字級下不能橫向捲動；每頁過 axe（含 `target-size`）；淺色與深色模式都要看得清楚。
- `pnpm test && pnpm build && pnpm test:e2e` 在每個 Task 結束時全綠。

## 決定（Debra 2026-11-09 同意）

- 哪些主題有圖：至少一半段落的內容本身是分類、並列或明確對比。依盤點是 T0、T2、T5、T6、T7、T8、T9、T11、T12、Q1、Q2、Q5、Q6、Q7、Q8、Q9、Q11、Q12、Q14、Q15，共 20 個；T1、T3、T4、T10、Q3、Q4、Q10、Q13、Q16 不放。
- 用 Markmap：樹往右長、彎曲的彩色分支。
- 第一層是各段（段落標題、連到該段），作者只寫第二、三層。
- 滑鼠或鍵盤停在段落節點上時，圖正下方的面板顯示該段標題與結論，不另寫懸停文字；離開後面板保留最後一段，直到停在另一段。面板一開始顯示一句提示。
- 不收合：每張圖全部展開，節點多的圖就比較高。
- 窄螢幕與沒有滑鼠的裝置（含橫放的平板）不畫 Markmap，顯示直式樹狀圖：同一份大綱的巢狀清單，每一段一種顏色、彎曲的分支線、字會換行，樹往下長；顏色和桌機心智圖的同一段相同。
- 有圖的主題，圖取代「本頁段落」清單；沒有圖的主題不變。
- 例子不再以「書中」／“The book”開頭，句中也不提書；設計稿 §5.2「書中例子以『書中』開頭」那條改掉。

## 開始之前

- PR #4 的分組頁改動已 commit 並推上去（`154c45e`；心智圖取代的「本頁段落」清單是那批改動加的）。本分支 `mind-maps` 從 `phase-4-second-zone` 開出，堆疊在 PR #4 上。

## 我做的決定（請檢查）

- 新增一個 UI 字串：面板的提示。zh-TW「把滑鼠移到段落上，或用 Tab 鍵，這裡會顯示該段的結論；點一下跳到該段。」en “Point at a section, or Tab to it, to see its conclusion here; click to go to it.”
- 節點標籤只寫中文，不套「中文（English）」：標籤是短詞，括號會讓圖變寬；術語的英文在面板的結論裡。英文版的標籤用術語表的英文。
- 心智圖算這頁的段落導覽，不另加圖說；AGENTS.md「圖要有圖說」那條註明這個例外。
- 只有一段的主題（T11）照樣畫出段落那一層，所有主題同一種形狀。
- 圖以原尺寸畫，不縮小：關掉縮放、拖曳與展開收合；高度用畫出來的實際高度；畫出來比主欄寬時，改回直式樹狀圖。
- 畫圖的條件是 `(min-width: 1024px) and (hover: hover)`：1024px 是兩欄版面出現的寬度。
- 不先閃出樹狀圖：`index.html` 在畫面出現前執行的那段腳本，替 `<html>` 加上 `data-js`；符合畫圖條件且有 `data-js` 時，樹狀圖先保留位置但不顯示，等決定好（畫好，或畫不下、載入失敗而改回樹狀圖）才換上。沒有 JavaScript 時照常顯示樹狀圖。
- 例子改寫後，讀者分不出哪些例子取自書、哪些是我們舉的（`ours`，共 8 個）；整個網站都是我們的詮釋，所以接受。`source` 標記留在資料裡，不顯示。
- 引述研究或數字的例子改成「一項研究發現……」這類寫法，不提書，但仍看得出是研究結果。
- D1 實驗課「真實世界」那一列的標籤「書中例子」／“In the book”改成「經典例子」／“Classic examples”，和旁邊的「公開做法」「常見模式」並列。
- 這是一隻新 PR，疊在 #4 上；不動 `CURRENT_PHASE`（圖附在已上線的主題頁上，沒有新頁面）。

## Review Focus

- 預先產生的頁面與瀏覽器上第一次的畫面要一樣（都是樹狀圖），心智圖之後才換上；否則 hydration 會報不同 → Task 2 的 hydration 測試加入 T6。
- 視窗從寬拉窄、再拉寬時，樹狀圖和心智圖要跟著換，不能兩個都沒有；Markmap 載入失敗時要看得到樹狀圖 → Task 3 的 e2e。
- 只用鍵盤的讀者要能 Tab 到每個段落節點、在面板看到結論、按 Enter 跳到該段 → Task 3 的 e2e。
- 英文標籤比較長：畫出來比主欄寬時要改回樹狀圖，而不是縮小或橫向捲動 → Task 4 的 e2e 逐頁檢查 20 個主題的英文頁。
- 深色模式下 Markmap 內建的淺色樣式（`#333` 文字、白色圓點）看不清楚 → Task 3 把 Markmap 的 CSS 變數接到網站的顏色變數，並截深色模式的圖。
- 拿掉「書中」後，原本轉述書的說法可能變成網站自己的斷言，或意思被改掉 → Task 5 把每一處改寫列成中英對照清單請 Debra 看過。

---

### Task 1: 大綱的資料，先做 T6

**Files:**
- Modify: `src/content/types.ts`（`MapNode`、`SectionText.map`）、`src/content/{zh-TW,en}/topics/t6.ts`（第一個有 `map` 的主題，後面的 Task 都用它測）
- Create: `src/content/topicMap.ts`、`src/content/topicMap.test.ts`

**Interfaces:**
- Produces:
  - `type MapNode = string | readonly [label: string, children: readonly string[]]`（`types.ts`）。只有兩層：遞迴的型別會讓 `Translation<T>` 觸發 TS2589（實測）。
  - `SectionText` 多一個 `readonly map?: readonly MapNode[]`
  - `type MapTree = { label: string; href?: string; conclusion?: string; children: MapTree[] }`
  - `topicMap(text: Text, topic: TopicId, base: string): MapTree | null`（`Text` 來自 `src/i18n/text`，e2e 在 Node 裡也能用）：沒有任何一段有 `map` 時回傳 `null`。根是主題標題（沒有 `href`）；第一層每段一個，`label` 用 `sectionTitle(...).title`、`href` 是段落連結、`conclusion` 是該段結論、`children` 來自該段的 `map`（沒有就是空的）。

- [ ] **Step 1: 寫失敗的測試** `topicMap.test.ts`（真內容）：
  - `沒有 map 的主題回傳 null`：T1。
  - `第一層是各段，依段落順序，帶標題、段落連結與結論`：T6 兩種語言；`href` 等於 `/b/<lang>/topics/t6/#<id>`，`conclusion` 等於該段結論。
  - `map 變成第二、三層`：zh-TW T6「防止遺失更新」的子節點標籤依序是 `['起因：讀取-修改-寫入', '三種防法']`，`三種防法` 的子節點是 `['資料庫一步完成', '先加鎖', '寫入時檢查版本']`。
  - `沒寫 map 的段落照樣出現在第一層，沒有子節點`：把 T6 一段的 `map` 拿掉的副本。
- [ ] **Step 2:** `pnpm vitest run src/content/topicMap.test.ts`，預期 FAIL（模組不存在）。
- [ ] **Step 3:** 實作型別與 `topicMap.ts`；照盤點的 T6 大綱（去掉第一層）寫 zh-TW 的 `map`，再寫 en。英文少一個或多一個分支時 typecheck 會失敗（TS2322／TS2741），不用另寫測試。
- [ ] **Step 4:** 同一指令預期 PASS；`pnpm typecheck` 通過。
- [ ] **Step 5: Commit**（等 Debra 說 commit）

### Task 2: 主題頁的直式樹狀圖

**Files:**
- Create: `src/components/TopicMap.tsx`
- Modify: `src/components/TopicPage.tsx`（「本頁段落」那段）、`src/styles/app.css`
- Test: `src/app/App.test.tsx`

**Interfaces:**
- Consumes: `topicMap`、`MapTree`（Task 1）
- Produces:
  - `BRANCH_COLORS: readonly string[]`（`src/components/branchColors.ts`）：第 i 段用 `BRANCH_COLORS[i]`。值是 d3 `schemeCategory10` 去掉第一個（藍色留給根）：`['#ff7f0e', '#2ca02c', '#d62728', '#9467bd', '#8c564b', '#e377c2', '#7f7f7f', '#bcbd22', '#17becf']`。
  - `TopicMap({ tree }: { tree: MapTree })`，先輸出直式樹狀圖 `<ul class="topic-map-list">`：第一層是段落連結，每一段的 `<li>` 帶 `style={{ '--branch': BRANCH_COLORS[i] }}`，下面是 `<ul>`。Task 3 在同一個元件裡加上畫圖與面板，並加一個 `content: Content` prop（面板提示要用）。

- [ ] **Step 1: 寫失敗的測試**（`App.test.tsx`，T6、phase 4）：
  - `有圖的主題：本頁段落是巢狀大綱，第一層連到各段，下面是 map 的分支`：`getByRole('navigation', { name: ui.nav.sections })` 裡第一層連結的 `href` 依序等於各段連結；分支文字照順序出現。
  - `每一段帶自己的分支顏色`：第 i 段的 `<li>` 的 `--branch` 等於 `BRANCH_COLORS[i]`。
  - `沒有圖的主題：本頁段落仍是原本的編號清單`（現有測試保留）。
  - hydration 測試的路由清單加入 T6。
- [ ] **Step 2:** `pnpm vitest run src/app/App.test.tsx`，預期新測試 FAIL。
- [ ] **Step 3:** `TopicPage` 的 `<nav className="topic-sections">` 保留標籤；`topicMap(...)` 不是 `null` 時放 `<TopicMap … />`，否則放原本的 `<ol>`。樹狀圖樣式（純 CSS）：沒有項目符號與編號；段落名稱粗體，底下一條 3px `var(--branch)` 的線；子項目用 `::before` 畫 2px `var(--branch)` 的直線加圓角轉彎接到文字、`::after` 接到下一個兄弟，最後一個不接；第三層字級小一號；文字自然換行。
- [ ] **Step 4:** 同一指令預期 PASS；`pnpm test && pnpm build` 通過。
- [ ] **Step 5: Commit**（等 Debra 說 commit）

### Task 3: 有滑鼠的寬螢幕畫成心智圖

**Files:**
- Modify: `package.json`、`index.html`（`data-js`）、`src/components/TopicMap.tsx`、`src/styles/app.css`、`src/test/setup.ts`（jsdom 沒有 `matchMedia`：預設回傳 `matches: false` 的 stub）、`src/content/{zh-TW,en}/ui.ts`（`map.hint`）
- Create: `src/components/drawMap.ts`（唯一 import markmap 的檔案）、`e2e/topic-map.spec.ts`

**Interfaces:**
- Consumes: `MapTree`（Task 1）；`TopicMap`、`BRANCH_COLORS`（Task 2）
- Produces:
  - `drawMap(svg: SVGSVGElement, tree: MapTree): Promise<{ width: number; destroy(): void }>`：以原尺寸畫好，把 svg 高度設成內容高度，回傳內容寬度。
  - `ui.map.hint`（兩種語言，文字見「我做的決定」）

- [ ] **Step 1: 寫失敗的 e2e** `e2e/topic-map.spec.ts`（desktop project 1440px，除非另寫）：
  - `有滑鼠的寬螢幕畫出心智圖，取代樹狀圖`：T6 頁上 `.topic-map svg` 可見，`.topic-map-list` 不在；面板顯示 `ui.map.hint`。
  - `滑鼠停在段落節點上，面板顯示該段標題與結論；移開後保留`：文字等於該段結論。
  - `鍵盤 Tab 到段落節點時面板顯示結論，Enter 跳到該段`：URL 的 hash 變成該段 id。
  - `點圓點不會收合任何分支`：用 `page.mouse.click` 點第一個段落節點圓點的座標（圓點是 `pointer-events: none`，locator 的 click 會等不到），分支節點數不變。
  - `視窗拉到 800px 換成樹狀圖，拉回 1440px 換回心智圖`。
  - `Markmap 載入失敗時顯示樹狀圖`：用 `page.route` 讓 markmap 的 chunk 回 404。
  - `沒有 JavaScript 時顯示樹狀圖`：`javaScriptEnabled: false` 的 context，樹狀圖可見。
  - `每一段的分支顏色和窄螢幕的樹狀圖相同`：T6 第一段的分支線 `stroke` 等於 `BRANCH_COLORS[0]`。
  - `深色模式下節點文字用網站的文字顏色`：`colorScheme: 'dark'` 時，節點文字的 `color` 等於 `--text` 的值。
  - mobile project：`窄螢幕只有樹狀圖，沒有 svg`。
- [ ] **Step 2:** `BASE_PATH=/data-systems-lab/ pnpm build && BASE_PATH=/data-systems-lab/ pnpm exec playwright test e2e/topic-map.spec.ts`，預期 FAIL。
- [ ] **Step 3:** 實作：
  - `pnpm add markmap-view@0.18.12 markmap-common@0.18.9`（精確版本）。
  - `drawMap`：把 `MapTree` 轉成 markmap 節點（`content` 是跳脫過的 HTML；段落節點是 `<a href>`）；每個節點的 `payload.branch` 記它所屬段落的序號；`Markmap.create(svg, { color: (node) => <根用 '#1f77b4'，其他用 BRANCH_COLORS[node.payload.branch]>, zoom: false, pan: false, duration: 0, maxInitialScale: 1 }, data)`，等畫好後讀內容的寬高（`mm.state.rect` 的 `x2 - x1`、`y2 - y1`），把 svg 高度設成內容高度再 `fit()` 一次（建立時 svg 還沒有高度，第一次 fit 會縮小）。
  - `TopicMap`：第一次 render 永遠是樹狀圖（與預先產生的 HTML 相同）；`useEffect` 用 `matchMedia('(min-width: 1024px) and (hover: hover)')` 決定是否畫圖，並監聽 `change`；畫圖時 `await import('./drawMap')`；回傳的寬度大於容器寬度、或 import 失敗時，`destroy()` 並顯示樹狀圖；變窄或卸載時 `destroy()`。顯示與否用元件上的一個 class 控制，CSS 只在 `[data-js]` 且符合畫圖條件時先隱藏樹狀圖。
  - 面板：圖正下方的 `<p className="topic-map-conclusion" aria-live="polite">`，一開始是 `ui.map.hint`；在 svg 容器上監聽 `mouseover` 與 `focusin`，用 `closest('a[href*="#"]')` 找到段落，顯示該段標題與 `conclusion`。
  - CSS：圓點 `pointer-events: none`、游標不變（不收合；Markmap 只在圓點上綁 click，已對照 0.18.12 原始碼）。顏色與字級只設 Markmap 自己的 CSS 變數，不覆寫它的選擇器：`--markmap-text-color: var(--text)`、`--markmap-circle-open-bg: var(--surface)`、`--markmap-a-color` 用網站的連結色、`--markmap-font` 用 `1rem` 與網站字型；深色模式自動跟著網站的變數。
- [ ] **Step 4:** 同一 e2e 指令預期 PASS；再跑 `pnpm test && pnpm build && pnpm test:e2e`。確認沒有圖的頁面不載入 markmap：build 輸出裡 markmap 在獨立的 chunk，主 bundle 與改動前相差不到 2 kB。
- [ ] **Step 5: Commit**（等 Debra 說 commit）

### Task 4: 其餘 19 個主題的分支與規則

**Files:**
- Modify: 其餘 19 個主題的 `src/content/{zh-TW,en}/topics/*.ts`（加 `map`）、`docs/glossary.md`（若有新詞）、`docs/2026-10-24-site-design.md`（§5.2 加入心智圖，取代「本頁段落」的那一條）、`AGENTS.md` 與 `CLAUDE.md`（Learner-facing rules 加心智圖的規則；圖說那條註明心智圖例外）
- Test: `src/content/content.test.ts`、`e2e/topic-map.spec.ts`

**Interfaces:**
- Consumes: `SectionText.map`、`topicMap`（Task 1）；`drawMap` 的寬度判斷（Task 3）

- [ ] **Step 1: 寫失敗的測試**：
  - `有圖的主題正好是這 20 個`（`content.test.ts`）：列表寫死在測試裡，對照 `topicMap(...) !== null`。
  - `分支標籤夠短`（`content.test.ts`）：中文不超過 14 個字，英文不超過 40 個字元。
  - `20 個主題的英文頁都畫得下或改回樹狀圖，沒有橫向捲動`（`e2e/topic-map.spec.ts`，desktop project，這個測試自己把視窗設成 1024px）：每頁 `scrollWidth - innerWidth <= 1`，且 svg 不比 `main` 寬。
  - 現有的「中文檔每個字串都有中文」「英文檔沒有中文」自動涵蓋 `map`。
- [ ] **Step 2:** `pnpm vitest run src/content/content.test.ts`，預期 FAIL（目前只有 T6 有圖）。
- [ ] **Step 3:** 先只做 Q7（最大的圖）兩種語言，跑寬度的 e2e，截 1440px 與 375px 的圖給 Debra 看；英文版若畫不下而改回樹狀圖，先和 Debra 調整標籤規則，再做其餘 18 個。依盤點的大綱寫 zh-TW 的 `map`（去掉第一層），再寫 en；對照該段結論，只留結論裡寫出的分支。規則寫進設計稿 §5.2 與 AGENTS.md：哪些主題放、第一層是段落、分支只來自結論、選項只寫名稱、不放取捨／問題／例子、標籤不套「中文（English）」、心智圖不另加圖說。
- [ ] **Step 4:** `pnpm test && pnpm build && pnpm test:e2e` 全綠；用暫時的 `e2e/tmp-*.spec.ts` 截 20 頁的圖（兩種語言、1440px，淺色與深色），加上 T6、Q7 的 375px 與 200% 字級，讀過再刪掉 spec。
- [ ] **Step 5: Commit**（等 Debra 說 commit）

### Task 5: 畫面上的文字不再提「書中」

和 Task 1–4 無關（心智圖只新增 `map` 欄位，不碰例子），先做或後做都可以。

**Files:**
- Modify: 所有主題的 `src/content/{zh-TW,en}/topics/*.ts`、`src/content/{zh-TW,en}/labs/d1.ts`（約 93 個中文例子、約 100 處英文，加上句中與實驗課的幾處）、`src/content/content.test.ts`、`docs/2026-10-24-site-design.md`（§5.2 例子那條）、`docs/2026-11-05-phase-4-plan.md`（Global Constraints 裡「書中例子以『書中』開頭」那條）、`AGENTS.md` 與 `CLAUDE.md`（Content and languages 加一條）
- Test: `src/content/content.test.ts`

- [ ] **Step 1: 改測試，讓它失敗**：現有的 `every book example opens by naming the book, no example of ours does, and none cites a page` 改成 `no on-screen text mentions the book, and no example cites a page`：走過兩種語言的所有主題與實驗課字串，中文不能符合 `/書中|書裡|本書/`，英文不能符合 `/\bthe book\b/i`；頁碼的檢查保留。地圖頁的致謝（`ui.bookSource`）不在檢查範圍。
- [ ] **Step 2:** `pnpm vitest run src/content/content.test.ts`，預期 FAIL，列出所有提到書的字串。
- [ ] **Step 3:** 逐句改寫，zh-TW 先、en 後：拿掉開頭的「書中說／書中的／書中提到」，讓句子自己成立（「書中的付款流程：先呼叫……」→「付款流程：先呼叫……」）；引述研究或數字的寫成「一項研究發現……」；D1 的「書中例子」標籤改成「經典例子」／“Classic examples”；不改例子的內容與數字；`source` 標記不動。設計稿 §5.2、phase 4 計畫與 AGENTS.md 的規則一起改。
- [ ] **Step 4:** `pnpm test && pnpm build && pnpm test:e2e` 全綠；每一處改寫列成中英對照清單（改前、改後）請 Debra 看過，特別是原本「書中說……」的斷言。
- [ ] **Step 5: Commit**（等 Debra 說 commit）
