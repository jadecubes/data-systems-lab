# 主題頁心智圖實作計畫

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking. The repository's `AGENTS.md` governs verification and forbids commits until Debra explicitly asks for one; every "Commit" step below waits for that.

**Goal:** 在適合的 20 個主題頁加上兩種顯示方式，頁首的切換鈕在「心智圖」與「文字」之間切換。心智圖一眼看到主題的結構，滑鼠或鍵盤停在段落節點上，圖下方顯示該段結論，點了切到文字並跳到該段；文字就是現在的整頁內容。

**Architecture:** 兩種顯示方式都在預先產生的 HTML 裡，`<html data-topic-view>` 決定顯示哪一個（由 `index.html` 的腳本設定，和目錄開關同一個做法）；心智圖那邊先是 CSS 畫的直式樹狀圖，有滑鼠且放得下時換成 Markmap。

**Tech Stack:** React 18、Vite 5、vitest、Playwright；新增 `markmap-view@0.18.12`、`markmap-common@0.18.9`（精確版本，只在有圖的頁面動態載入）。

**Spec:** `docs/2026-10-24-site-design.md`（Task 4 在 §5.2 加入心智圖與切換鈕）。盤點（每段的適合度與大綱，Debra 2026-11-09 看過）：`~/.claude/memories/data-systems-lab-mindmap-survey-{T,Q}.md`，只在 Debra 的機器上（memories 的 `.gitignore` 排除，不進任何 repo）。

畫面上的文字不再提「書中」是另一份計畫、另一隻 PR：`docs/2026-11-11-no-book-mentions-plan.md`。

## Global Constraints

- 元件裡沒有文字；所有字串從 `src/content/<lang>/` 經 `Content` 物件來。
- 先寫 zh-TW 再寫 en，同一次改動；英文用術語表的詞；英文檔不能有中文。
- 內部連結是以 base 開頭、以 `/` 結尾的絕對路徑；段落連結是 `<主題路徑>#<段落 id>`。
- 分支只用結論裡已經寫出的東西；不改任何結論、取捨、問題、例子的文字。
- 取捨不拆：選項節點只寫名稱（「最後寫入者勝」），不寫代價或評語。
- 新寫的文字（分支標籤、面板提示）不用「書中」「The book」轉述書。
- 375px 與 200% 字級下不能橫向捲動；每頁過 axe（含 `target-size`）；淺色與深色模式都要看得清楚。
- `pnpm test && pnpm build && pnpm test:e2e` 在每個 Task 結束時全綠。

## 決定（Debra 同意）

- 哪些主題有圖：至少一半段落的內容本身是分類、並列或明確對比。依盤點是 T0、T2、T5、T6、T7、T8、T9、T11、T12、Q1、Q2、Q5、Q6、Q7、Q8、Q9、Q11、Q12、Q14、Q15，共 20 個；T1、T3、T4、T10、Q3、Q4、Q10、Q13、Q16 不放。
- 用 Markmap：樹往右長、彎曲的彩色分支。
- 第一層是各段（段落標題、連到該段），作者只寫第二、三層。
- 滑鼠或鍵盤停在段落節點上時，圖正下方的面板顯示該段標題與結論，不另寫懸停文字；離開後面板保留最後一段，直到停在另一段。面板一開始顯示一句提示。
- 不收合：每張圖全部展開，節點多的圖就比較高。
- 沒有滑鼠的裝置（手機、平板）顯示直式樹狀圖：同一份大綱的巢狀清單，每一段一種顏色、彎曲的分支線、字會換行，樹往下長；顏色和心智圖的同一段相同。
- 有圖的主題，頁首有切換鈕，在心智圖與文字之間切換（2026-11-11）；文字顯示方式和現在的主題頁相同，含「本頁段落」清單。沒有圖的主題不變，沒有切換鈕。

## 我做的決定（請檢查）

- 沒選過的讀者先看到心智圖；選擇全站共用，存不了（私密視窗、封鎖網站資料）時只在這一頁有效。
- 網址的 hash 是段落時顯示文字：從別處連到某一段、或在心智圖上點了段落，都直接讀到那段，焦點也移到那段；上一頁回到沒有 hash 的網址時，回到讀者選的方式。在心智圖上點段落不改存下來的選擇。其他 hash（跳過目錄的 `#main`）不改顯示方式。上一頁回到心智圖時，焦點移到剛才那一段的節點。代價：心智圖→跳過目錄→點段落→上一頁，網址是 `#main`、畫面是文字，重新整理卻是心智圖。
- 切換鈕是兩個並排的按鈕（`aria-pressed`），群組名稱「顯示方式」，放在學習標籤與實驗課連結下面、內容上面，出現前先保留高度。和目錄開關一樣，JavaScript 執行後才出現；沒有 JavaScript、app 的腳本載入失敗、或別名頁時，只有文字，沒有切換鈕。按「心智圖」時拿掉網址的 hash（重新整理仍是心智圖），按「文字」不動網址。代價：在心智圖點了段落再按「心智圖」，第一次上一頁看起來沒變（兩筆紀錄網址相同）。
- 切換鈕不放進固定的頁首（375px 的頁首只容得下兩行）：在文字裡讀到下面時，回心智圖靠捲回頂端或上一頁。上一篇／下一篇在兩種顯示方式下都在。
- 名稱一律用 mind map（`mindMap`、`MindMap`、`.mind-map`、`.topic-view-mind-map`、顯示方式 `'mindmap'`），不用單獨的 map：網站已經有「地圖」頁（`kind: 'map'`、`map.spec.ts`）。
- 新增 UI 字串：`view.label`「顯示方式」／“View”、`view.mindMap`「心智圖」／“Mind map”、`view.text`「文字」／“Text”；面板提示 `view.hint` zh-TW「把滑鼠移到段落上，或用 Tab 鍵，這裡會顯示該段的結論；點一下讀那一段。」en “Point at a section, or Tab to it, to see its conclusion here; click to read it.”
- 節點標籤只寫中文，不套「中文（English）」：標籤是短詞，括號會讓圖變寬；術語的英文在面板的結論裡。英文版的標籤用術語表的英文。
- 心智圖是同一頁內容的另一種顯示方式，不另加圖說；AGENTS.md「圖要有圖說」那條註明這個例外。
- 只有一段的主題（T11）照樣畫出段落那一層，所有主題同一種形狀。
- 圖以原尺寸畫；主欄放不下、或畫好後讀者改了字級時，改回樹狀圖。Task 3 用 T6 定下標籤換行與間距，Task 4 確認 20 頁兩種語言在 1024px（兩欄版面最窄的主欄，約 700px）都畫得下，退回樹狀圖只是保險。
- Markmap 只看有沒有滑鼠（`(hover: hover)`），寬度交給「放不下就用樹狀圖」決定，不另設斷點。
- Markmap 畫好之前顯示樹狀圖。代價：寬螢幕每次載入都先看到樹狀圖一下子，下面的內容會移動；從下一個主題按上一頁時，捲動位置可能對著樹狀圖的高度還原。換來的是 Markmap 載入慢或卡住時不會一片空白。
- 面板固定在視窗底部，並讓鍵盤捲動的位置避開它：大的圖（Q7 約 70 個節點）比視窗高，指著上面的段落時面板仍看得到，焦點節點不會被它蓋住。
- 螢幕閱讀器在桌機的心智圖上依大綱順序念，但聽不出層級（手機的樹狀圖是巢狀清單，聽得出）；接受，文字顯示方式就在切換鈕上。
- Task 1–4 是一隻新 PR，疊在 #4 上；不動 `CURRENT_PHASE`（圖附在已上線的主題頁上，沒有新頁面）。和「書中」那隻 PR 改同樣的主題檔，後合併的那隻要 rebase。

## Review Focus

- 預先產生的頁面與第一次 render 一樣 → Task 2 的 hydration 測試加入 T6。
- 讀者不能卡在沒有切換鈕的心智圖（沒有 JavaScript、app 腳本載入失敗、別名頁）→ Task 2 的 e2e。
- hash、上一頁、storage 丟錯、React 接手前點擊時，顯示方式、捲動位置與焦點都對 → Task 2 的 e2e。
- 心智圖畫不出、放不下、或在隱藏時載入完成，都不能空白或橫向捲動 → Task 3、Task 4 的 e2e。
- 只用鍵盤與螢幕閱讀器：順序、焦點框、面板不蓋住焦點；深色模式 → Task 3 的 e2e。

---

### Task 1: 大綱的資料，先做 T6

**Files:**
- Modify: `src/content/types.ts`（`MindMapNode`、`SectionText.mindMap`）、`src/content/{zh-TW,en}/topics/t6.ts`（第一個有 `mindMap` 的主題，後面的 Task 都用它測）
- Create: `src/content/mindMap.ts`、`src/content/mindMap.test.ts`

**Interfaces:**
- Produces:
  - `type MindMapNode = string | readonly [label: string, children: readonly (string | readonly [label: string, children: readonly string[]])[]]`（`types.ts`）：段落下最多三層，寫死層數不用遞迴（遞迴的型別會讓 `Translation<T>` 觸發 TS2589，實測）。
  - `SectionText` 多一個 `readonly mindMap?: readonly MindMapNode[]`
  - `type MindMapTree = { label: string; href?: string; conclusion?: string; children: MindMapTree[] }`
  - `mindMapOf(text: Text, topic: TopicId, base: string): MindMapTree | null`（`Text` 來自 `src/i18n/text`，e2e 在 Node 裡也能用）：沒有任何一段有 `mindMap` 時回傳 `null`。根是主題標題（沒有 `href`）；第一層每段一個，`label` 用 `sectionTitle(...).title`、`href` 是段落連結、`conclusion` 是該段結論、`children` 來自該段的 `mindMap`（沒有就是空的）。

- [ ] **Step 1: 寫失敗的測試** `mindMap.test.ts`（真內容）：
  - `沒有 mindMap 的主題回傳 null`：T1。
  - `第一層是各段，依段落順序，帶標題、段落連結與結論`：T6 兩種語言；`href` 等於 `/b/<lang>/topics/t6/#<id>`，`conclusion` 等於該段結論。
  - `mindMap 變成第二、三層`：zh-TW T6「防止遺失更新」的子節點標籤依序是 `['起因：讀取-修改-寫入', '三種防法']`，`三種防法` 的子節點是 `['資料庫一步完成', '先加鎖', '寫入時檢查版本']`。
  - `沒寫 mindMap 的段落照樣出現在第一層，沒有子節點`：把 T6 一段的 `mindMap` 拿掉的副本。
  - `第三層的分支也轉進去`：在 T6 副本的一個分支下加一層。
- [ ] **Step 2:** `pnpm vitest run src/content/mindMap.test.ts`，預期 FAIL（模組不存在）。
- [ ] **Step 3:** 實作型別與 `mindMap.ts`；照盤點的 T6 大綱（去掉第一層）寫 zh-TW 的 `mindMap`，再寫 en。英文少一個或多一個分支時 typecheck 會失敗（TS2322／TS2741），不用另寫測試。
- [ ] **Step 4:** 同一指令預期 PASS；`pnpm typecheck` 通過（確認三層的型別沒有觸發 TS2589）。
- [ ] **Step 5: Commit**（等 Debra 說 commit）

### Task 2: 兩種顯示方式與切換鈕，心智圖那邊先用直式樹狀圖

**Files:**
- Create: `src/app/topicView.ts`、`src/components/ViewSwitch.tsx`、`src/components/MindMap.tsx`、`src/components/branchColors.ts`、`e2e/mind-map.spec.ts`
- Modify: `index.html`、`src/entry-client.tsx`、`src/components/TopicPage.tsx`、`src/styles/app.css`、`src/content/{zh-TW,en}/ui.ts`（`view`）
- Test: `src/app/App.test.tsx`、`e2e/not-found.spec.ts`、`e2e/crawl.spec.ts`

**Interfaces:**
- Consumes: `mindMapOf`、`MindMapTree`（Task 1）
- Produces:
  - `index.html` 的腳本（顯示方式的規則只寫在這裡）：
    - 載入時：讀一次存的選擇（`data-systems-lab.view`），`data-view-choice` 設成 `'text'`（存的是 `'text'`）或 `'mindmap'`（其他，含 storage 丟錯）；`data-topic-view` 在 hash 非空且不是 `#main` 時設成 `'text'`，否則等於 `data-view-choice`。
    - `hashchange`：沒有 `data-view-choice` 時不做事（app 沒起來，只有文字）。hash 空 → `data-view-choice`；hash 指的元素在 `.topic-view-text` 裡 → `'text'`；其他 hash 不變。從 `'mindmap'` 變成 `'text'` 時，對該元素 `scrollIntoView()`，再設 `tabIndex = -1` 並 `focus({ preventScroll: true })`（點的當下段落還是隱藏的，瀏覽器沒捲到，焦點也還在變隱藏的節點上）。從 `'text'` 變成 `'mindmap'` 時，焦點移到 `.topic-view-mind-map` 裡連到 `event.oldURL` 那個 hash、而且看得見（`checkVisibility({ visibilityProperty: true })`，排除放不下而隱藏的 svg）的連結；不用 `preventScroll`，讓節點捲進視窗。
    - module 腳本載入失敗的那行（用現有的同一個條件）：拿掉 `data-topic-view` 與 `data-view-choice`。
  - `src/app/topicView.ts`（照 `indexToggle.ts` 的樣子）：`type TopicView = 'mindmap' | 'text'`；`VIEW_KEY = 'data-systems-lab.view'`；`currentView(): TopicView` 讀 `data-topic-view`，不是 `'mindmap'` 就是 `'text'`（和 CSS 一致）；`chooseView(view: TopicView): void` 設 `data-topic-view` 與 `data-view-choice`、存起來（storage 丟錯就略過），`view` 是 `'mindmap'` 且網址有 hash 時用 `history.replaceState` 拿掉。
  - `BRANCH_COLORS: readonly string[]`（`src/components/branchColors.ts`）：第 i 段用 `BRANCH_COLORS[i]`。值是 d3 `schemeCategory10` 去掉第一個（藍色留給根）：`['#ff7f0e', '#2ca02c', '#d62728', '#9467bd', '#8c564b', '#e377c2', '#7f7f7f', '#bcbd22', '#17becf']`。
  - `MindMap({ tree }: { tree: MindMapTree })`：根是 `<div className="mind-map">`，裡面是直式樹狀圖 `<ul className="mind-map-list">`：第一層是段落連結（一般的連結，沒有 click handler），每一段的 `<li>` 帶 `style={{ '--branch': BRANCH_COLORS[i] }}`，下面是 `<ul>`。
  - `ViewSwitch({ content }: { content: Content })`：外框 `<div className="view-switch">` 一直都在；和 `IndexToggle` 一樣，state 在 effect 之前是 `null`、不輸出按鈕；之後輸出 `role="group"`、`aria-label={ui.view.label}` 與兩個 `aria-pressed` 的按鈕，按鈕呼叫 `chooseView(view)`；監聽 `hashchange`，重讀 `currentView()` 更新按下的那一個。
  - `ui.view = { label, mindMap, text }`（兩種語言，文字見「我做的決定」）

- [ ] **Step 1: 寫失敗的測試**
  - `App.test.tsx`（T6、phase 4）：
    - `頁首的腳本依網址與存的選擇設好顯示方式`（照現有 `index.html` 腳本測試的做法，`new Function(script)()`）：沒存、沒 hash → `mindmap`；存了 `text` → `text`；`#<段落>` → `text`；`#main` → 存的那一個；storage 丟錯加 `#<段落>` → `text`；storage 丟錯、沒 hash → `mindmap`。（`hashchange` 的行為由 e2e 在真的瀏覽器裡測。）
    - `有圖的主題：預先產生的 HTML 有兩種顯示方式`：`renderToString` 的結果裡，`.topic-view-mind-map` 有樹狀圖，第一層連結的 `href` 依序等於各段連結、分支文字照順序出現、第 i 段的 `<li>` 的 `--branch` 等於 `BRANCH_COLORS[i]`；`.topic-view-text` 有「本頁段落」清單與每一段；有 `.view-switch` 但裡面沒有按鈕。
    - `切換鈕：點「文字」後顯示文字並記住`（測試先像 `index.html` 一樣設 `data-topic-view='mindmap'`）：`data-topic-view` 變成 `'text'`、兩個按鈕的 `aria-pressed` 互換、`localStorage` 存了 `'text'`、網址不變；網址先用 `history.replaceState` 設成 `#<段落>`（不觸發 `hashchange`），再點「心智圖」換回來，網址沒有 hash。
    - `沒有圖的主題：沒有切換鈕，本頁段落仍是原本的編號清單`（現有測試保留並加上這條）。
    - hydration 測試的路由清單加入 T6。
  - `e2e/mind-map.spec.ts`（desktop 與 mobile project 都跑；只看 `.topic-view-mind-map`／`.topic-view-text` 是否可見，節點用 `.topic-view-mind-map` 裡的 `getByRole('link', { name })` 點，Task 3 換成 Markmap 後照樣成立）：
    - `沒選過時先看到心智圖；選了文字後，另一種語言的 T6 與重新整理都是文字`（Task 4 之前只有 T6 有圖）。
    - `帶 hash 打開時顯示文字，該段在頁首下方`。
    - `在心智圖上點一段：顯示文字、捲到該段、焦點在該段；上一頁回到心智圖，焦點在那一段的節點，而且節點在視窗裡`：`page.route` 先扣住 `**/assets/*.js`，扣住期間點一段並檢查文字可見、該段在頁首下方（放行後 `entry-client` 會再捲一次 `:target`，會蓋掉沒捲到的錯）；放行後按上一頁，檢查焦點。樹狀圖的連結沒有 click handler，React 接手前後走的是同一段頁首腳本，不另寫一個測試。
    - `跳過目錄的連結不換顯示方式`：心智圖上按它仍是心智圖；從 `#<段落>` 打開（文字）再按它，仍是文字。
    - `沒有 JavaScript：只有文字，沒有切換鈕`（`javaScriptEnabled: false` 的 context）。
    - `app 的腳本載入失敗：只有文字，沒有切換鈕；點「本頁段落」的一段再按上一頁，仍是文字`（和 `site-index.spec.ts` 一樣，`page.route` 擋掉 `**/assets/*.js`）。
    - `storage 丟錯時`（`addInitScript` 讓 `localStorage.getItem`／`setItem` 丟錯）：按「文字」、點「本頁段落」的一段、上一頁，仍是文字（storage 丟錯時的載入規則在 vitest 的表裡）。
  - `e2e/crawl.spec.ts`：有切換鈕的頁面，axe 與 375px／200% 寬度的檢查在兩種顯示方式各做一次（心智圖那邊等它畫好或確定是樹狀圖之後），段落區塊不會因為預設是心智圖而沒被檢查。crawl 會接近 240 秒的上限，需要時調高。
  - `e2e/not-found.spec.ts`：現有的別名頁測試加上有圖的 T6（`en/topics/t6/index.html`、`en//topics/t6/`）：文字看得見，或切換鈕看得見。
- [ ] **Step 2:** `pnpm vitest run src/app`，預期新測試 FAIL；`BASE_PATH=/data-systems-lab/ pnpm build && BASE_PATH=/data-systems-lab/ pnpm exec playwright test e2e/mind-map.spec.ts e2e/not-found.spec.ts`，預期新測試 FAIL。
- [ ] **Step 3:** 實作：
  - `index.html`：照上面的規則改現有腳本。
  - `entry-client.tsx`：別名頁「照原樣留著」的那個分支，除了 `data-index` 也拿掉 `data-topic-view` 與 `data-view-choice`（那頁沒有切換鈕）。
  - `TopicPage`：`mindMapOf(...)` 不是 `null` 時，學習標籤與實驗課連結下面放 `<ViewSwitch />`、`<div className="topic-view-mind-map"><MindMap … /></div>`、`<div className="topic-view-text">`（原本的「本頁段落」與各段）；是 `null` 時和現在一樣。
  - CSS：`:root[data-topic-view='mindmap'] .topic-view-text` 與 `:root:not([data-topic-view='mindmap']) .topic-view-mind-map` 不顯示；`.view-switch` 只在 `:root[data-topic-view]` 時保留高度（沒有 JavaScript 時不留空白）。切換鈕兩個按鈕並排，按下的那個用實心底色。樹狀圖照「決定」的樣子，純 CSS，線用 `var(--branch)`。
- [ ] **Step 4:** 同樣的指令預期 PASS；`pnpm test && pnpm build && pnpm test:e2e` 通過。
- [ ] **Step 5: Commit**（等 Debra 說 commit）

### Task 3: 有滑鼠時畫成心智圖

**Files:**
- Modify: `package.json`、`src/components/MindMap.tsx`（加 `content: Content` prop，面板提示要用）、`src/components/TopicPage.tsx`（傳 `content`）、`src/styles/app.css`、`src/test/setup.ts`（jsdom 沒有 `matchMedia`：回傳 `matches: false` 的 stub）、`src/content/{zh-TW,en}/ui.ts`（`view.hint`）、`e2e/mind-map.spec.ts`
- Create: `src/components/drawMindMap.ts`（唯一 import markmap 的檔案）

**Interfaces:**
- Consumes: `MindMapTree`（Task 1）；`MindMap`、`BRANCH_COLORS`（Task 2）
- Produces:
  - `drawMindMap(svg: SVGSVGElement, tree: MindMapTree): Promise<{ width: number }>`：原尺寸、不縮放不拖曳（滾輪捲動頁面）、沒有動畫與收合；段落節點是連到該段的 `<a>`；每個節點用所屬段落的 `BRANCH_COLORS`，根用 `'#1f77b4'`；節點在 DOM 裡依大綱順序（深度優先）；svg 高度設成內容高度；回傳內容寬度。
  - `MindMap` 根上的 class `is-drawn`：有它時顯示 svg 與面板，沒有時顯示樹狀圖。
  - `ui.view.hint`（兩種語言，文字見「我做的決定」）

- [ ] **Step 1: 寫失敗的 e2e**，加在 `e2e/mind-map.spec.ts`（desktop project 1440px，除非另寫）：
  - `有滑鼠時畫出原尺寸的心智圖，取代樹狀圖`：T6 頁上 `.mind-map svg` 可見，`.mind-map-list` 隱藏；圖沒有縮放（節點標籤方框的高度等於同字級一行字的高度，或 svg 內 `g` 的 transform 比例是 1）；面板顯示 `ui.view.hint`。
  - `滑鼠停在段落節點上，面板顯示該段標題與結論；移開後保留`：文字等於該段結論。
  - `鍵盤依段落順序 Tab 到每個段落節點，焦點框看得到、不被面板蓋住，面板顯示結論；Enter 切到文字並跳到該段`：視窗 1440×500（圖比視窗高）；面板一直在視窗內；焦點節點的 `outline-style` 不是 `none`；從短的面板文字 Tab 到視窗外、結論較長的節點，它的方框仍在面板上面；URL 的 hash 變成該段 id，該段在頁首下方。
  - `先選文字，再切回心智圖，心智圖畫得出來`：切回後 svg 的高度大於 0，`.mind-map-list` 隱藏。
  - `Markmap 在文字顯示方式時才載入完成，切回後仍畫得對`：`page.route` 先扣住 markmap 的 chunk，點一段（切到文字）再放行，按上一頁，svg 的高度大於 0。
  - `螢幕閱讀器的順序依大綱`：svg 裡節點文字的 DOM 順序等於 `mindMapOf` 的深度優先順序。
  - `點圓點不會收合任何分支`：用 `page.mouse.click` 點第一個段落節點圓點的座標（圓點是 `pointer-events: none`，locator 的 click 會等不到），分支節點數不變。
  - `主欄變窄到放不下圖時換成樹狀圖，沒有橫向捲動`：T6 英文頁 1440px 打開，把 `.topic-view-mind-map` 的寬度設成比 svg 窄（`page.evaluate`），樹狀圖出現、`scrollWidth - innerWidth <= 1`；寬度還原後換回心智圖。
  - `Markmap 載入失敗時顯示樹狀圖`：`page.route` 讓 markmap 的 chunk 回 404；樹狀圖可見，沒有 `pageerror`。
  - `每一段的分支顏色和樹狀圖相同`：T6 第一段的分支線 `stroke` 等於 `BRANCH_COLORS[0]`。
  - `深色模式下節點文字用網站的文字顏色`：`colorScheme: 'dark'` 時，節點文字的 `color` 等於 `--text` 的值。
  - `畫好後字級改成 200%，換成樹狀圖`：`Page.setFontSizes`（`map.spec.ts` 的做法）。
  - `滑鼠滾輪在圖上捲動的是頁面`：T6 視窗 1440×500，在 svg 上 `page.mouse.wheel`，`scrollY` 變大。
  - mobile project：`沒有滑鼠時只有樹狀圖，沒有 svg`。
- [ ] **Step 2:** `BASE_PATH=/data-systems-lab/ pnpm build && BASE_PATH=/data-systems-lab/ pnpm exec playwright test e2e/mind-map.spec.ts`，預期新測試 FAIL。
- [ ] **Step 3:** 實作：
  - `pnpm add markmap-view@0.18.12 markmap-common@0.18.9`（精確版本；確認 0.18.12 要的 markmap-common 是 0.18.9）。先對照 0.18.12 原始碼確認，不符時照實際的 API 做：關掉縮放、拖曳與滾輪的選項名稱（`zoom`／`pan`）、標籤換行的選項（`maxWidth`？）、`fitRatio`（預設 0.95，會讓 `fit()` 縮小）與 `maxScale`（小的圖可能被放大）、Markmap 是否只在圓點上綁收合的 click、讀內容寬高的方法（`mm.state.rect`？）、`create` 是否畫完才 resolve、量節點大小時 svg 是否必須已排版（不能是 `display: none`）、節點在 DOM 裡的順序（廣度優先時，畫好後依大綱順序把 `g.markmap-node` 重新 append，確認畫面不變、之後不會重畫）。
  - 先定版面：用 T6 兩種語言量畫出來的寬度。英文的根標題與長標籤會超過，所以在這裡定下標籤換行寬度、水平間距、根標題是否換行，讓 T6 兩種語言在 1024px 留一成餘裕畫得下；之後的測試都靠這組設定。字型寬度在不同機器上不同，餘裕就是為此留的。
  - `MindMap`：畫好之前顯示樹狀圖（第一次 render 與預先產生的 HTML 相同）。`matchMedia('(hover: hover)')` 不符就不畫，也不建立 `ResizeObserver`。用 `ResizeObserver` 看容器寬度：寬度是 0（文字顯示方式）的回報一律略過；第一次有寬度時 `await import('./drawMindMap')`，回來後容器寬度若已變回 0（讀者在等的時候切到文字），等下一次有寬度的回報再畫；畫一次並留著；之後每次回報只比較容器寬度與圖的寬度，放得下、而且根元素的字級和畫的時候相同，就加上 `is-drawn`，否則拿掉，不重畫。import 失敗時維持樹狀圖。CSS 只有一條隱藏規則：`.mind-map:not(.is-drawn) svg { visibility: hidden; position: absolute }`（畫的時候已排版、量得到大小），`.mind-map` 是 `position: relative; overflow: clip`（不撐寬頁面；`clip` 不會破壞面板的 sticky）。
  - 面板：圖正下方的 `<p className="mind-map-conclusion" aria-live="polite">`，`position: sticky; bottom: 0`，一開始是 `ui.view.hint`；在 svg 容器上監聽 `mouseover` 與 `focusin`，用 `closest('a[href*="#"]')` 找到段落，顯示該段標題與 `conclusion`。用同一個 `ResizeObserver` 把面板高度寫到 `document.documentElement` 的 `--panel-height`，CSS 在 `:root[data-topic-view='mindmap']` 時 `scroll-padding-bottom: var(--panel-height)`。寫完高度後，焦點若在 svg 裡，`document.activeElement.scrollIntoView({ block: 'nearest' })`：`focusin` 換了面板文字、瀏覽器已經用舊的高度捲過，面板長高會蓋住焦點節點。
  - CSS：`html { scrollbar-gutter: stable }`（傳統捲軸出現或消失會讓主欄寬度差約 15px，在臨界寬度來回切換）。圓點 `pointer-events: none`、游標不變（不能收合）。節點連結的焦點框用內縮的 `outline`（`foreignObject` 會切掉外面的部分）。顏色與字級只設 Markmap 自己的 CSS 變數，不覆寫它的選擇器：`--markmap-text-color: var(--text)`、`--markmap-circle-open-bg: var(--surface)`、`--markmap-a-color` 用網站的連結色、`--markmap-font` 用 `1rem` 與網站字型；深色模式自動跟著網站的變數。
- [ ] **Step 4:** 同一 e2e 指令預期 PASS；再跑 `pnpm test && pnpm build && pnpm test:e2e`。
- [ ] **Step 5: Commit**（等 Debra 說 commit）

### Task 4: 其餘 19 個主題的分支與規則

**Files:**
- Modify: 其餘 19 個主題的 `src/content/{zh-TW,en}/topics/*.ts`（加 `mindMap`）、`docs/glossary.md`（若有新詞）、`docs/2026-10-24-site-design.md`（§5.2 加入心智圖與切換鈕；文字顯示方式的「本頁段落」那條不變）、`AGENTS.md` 與 `CLAUDE.md`（Learner-facing rules 加心智圖的規則；圖說那條註明心智圖例外；開頭的 Current plan 指向這份計畫）
- Test: `src/content/content.test.ts`、`e2e/mind-map.spec.ts`

**Interfaces:**
- Consumes: `SectionText.mindMap`、`mindMapOf`（Task 1）；`MindMap` 的 `is-drawn`（Task 3）

- [ ] **Step 1: 寫失敗的測試**：
  - `有圖的主題正好是這 20 個`（`content.test.ts`）：列表寫死在測試裡，對照 `mindMapOf(...) !== null`。
  - `20 個主題在 1024px 都畫出心智圖，沒有橫向捲動`（`e2e/mind-map.spec.ts`，desktop project，這個測試自己把視窗設成 1024px，兩種語言）：每頁 `.mind-map` 有 `is-drawn`，且 `scrollWidth - innerWidth <= 1`。
  - 現有的「中文檔每個字串都有中文」「英文檔沒有中文」自動涵蓋 `mindMap`。
- [ ] **Step 2:** `pnpm vitest run src/content/content.test.ts`，預期 FAIL（目前只有 T6 有圖）。
- [ ] **Step 3:** 先只做 Q7（最大的圖）兩種語言，跑寬度的 e2e，截 1440px 與 375px 的圖給 Debra 看；用 Task 3 的版面設定仍畫不下時，先和 Debra 調整標籤規則（例如把最深一層併進上一層的標籤，「約束：唯一、外鍵」），再做其餘 18 個。依盤點的大綱寫 zh-TW 的 `mindMap`（去掉第一層），再寫 en；對照該段結論，只留結論裡寫出的分支；盤點和 Global Constraints 不一致時（例如 Q7 選項帶代價）照 Global Constraints，並在 Q7 的截圖時把這些改動列給 Debra。把「決定」與「我做的決定」裡給讀者與作者的規則寫進設計稿 §5.2 與 AGENTS.md。
- [ ] **Step 4:** `pnpm test && pnpm build && pnpm test:e2e` 全綠；照 AGENTS.md 截圖檢查，另外加上深色模式，以及 T6、Q7 以 200% 字級打開的畫面（兩種顯示方式）。在 Q7 確認：捲到下面、去下一個主題、按上一頁，捲動位置是否還原到原處；不是的話記下來給 Debra 決定。
- [ ] **Step 5: Commit**（等 Debra 說 commit）
