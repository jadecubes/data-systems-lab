# DDIA 內容索引：每段筆記放到網站哪裡

> 由 `scripts/build-content-index.mjs` 從 `~/.claude/memories/designing-data-intensive-applications.md`（筆記）與 `ddia-tpm-guide.md`（PM 篩選版）產生，不要手改；筆記或篩選版改了就重跑。
> 設計依據：`docs/2026-10-24-site-design.md`。用途：核對網站是否把計畫收錄的每一段都做成頁面。

## 怎麼用這份索引

- 「去處」寫主題頁的段落，網站上必須找得到。有沒有漏由測試核對（設計稿第 9.2 節），不在這裡打勾。
- 篩選版每筆條目用「章＋標題」對到筆記的一個段落；對不上、重複或解析不出來，產生器就失敗。
- 評級是篩選版的判斷（模型依筆記評，未經 PM 實務驗證）。「不收」的段落篩選版沒有逐段列出評級，評級欄空白。
- 章末的「名詞」「怎麼選」「容易誤解」「小結」也是段落，照樣列出。
- 篩選版開頭寫評了 416 段，筆記各章實際有 414 個標題，以本索引為準。
- 「PDF 頁」對照筆記用；「印刷頁」＝PDF 頁 − 24，是書上印的、網站上顯示的頁碼。
- 「段落 id」就是網站主題頁上該段區塊的 `id`，也是 `src/content/sections.ts` 與各語言內容檔的鍵。

## 總覽

| 項目 | 段數 |
|---|---|
| 筆記段落（各章 ###–##### 標題） | 414 |
| 收進主題頁（第一、二線） | 89 |
| 　其中第一線 T | 31 |
| 　其中第二線 Q | 58 |
| 一行版（這版不做） | 169 |
| 不收（懂名詞／跳過） | 156 |

## 依主題：每頁必須涵蓋的段落

### T1 非功能需求與可靠性：哪些要寫進 spec

| 筆記行 | 章 | 段落 | 段落 id | PDF 頁 | 印刷頁 | 產品 | 平台 |
|---|---|---|---|---|---|---|---|
| 320-323 | 2 | 引言：功能性與非功能性需求 | `ch2-intro-functional-and-nonfunctional-requirements` | 57 | 33 | 要會用 | 要會用 |
| 452-459 | 2 | Humans and Reliability（人與可靠性） | `ch2-humans-and-reliability` | 71–72 | 47–48 | 要會用 | 要會用 |
| 460-465 | 2 | How Important Is Reliability?（可靠性有多重要？） | `ch2-how-important-is-reliability` | 72–73 | 48–49 | 要會用 | 要能問 |

### T2 效能看百分位數，不看平均；SLO

| 筆記行 | 章 | 段落 | 段落 id | PDF 頁 | 印刷頁 | 產品 | 平台 |
|---|---|---|---|---|---|---|---|
| 385-391 | 2 | Average, Median, and Percentiles（平均數、中位數與百分位數） | `ch2-average-median-and-percentiles` | 64–65 | 40–41 | 要會用 | 要會用 |
| 399-403 | 2 | Use of Response Time Metrics（回應時間指標的用法） | `ch2-use-of-response-time-metrics` | 65–66 | 41–42 | 要會用 | 要會用 |

### T3 逾時：不知道到底成功沒有

| 筆記行 | 章 | 段落 | 段落 id | PDF 頁 | 印刷頁 | 產品 | 平台 |
|---|---|---|---|---|---|---|---|
| 224-231 | 1 | Problems with Distributed Systems（分散式系統的問題） | `ch1-problems-with-distributed-systems` | 44–45 | 20–21 | 要會用 | 要會用 |
| 1404-1414 | 5 | 遠端程序呼叫的問題（The problems with remote procedure calls） | `ch5-the-problems-with-remote-procedure-calls` | 207–208 | 183–184 | 要會用 | 要會用 |
| 2651-2663 | 9 | Unreliable Networks（不可靠的網路） | `ch9-unreliable-networks` | 371–372 | 347–348 | 要會用 | 要會用 |

### T4 安全重試：請求 ID 與去重

| 筆記行 | 章 | 段落 | 段落 id | PDF 頁 | 印刷頁 | 產品 | 平台 |
|---|---|---|---|---|---|---|---|
| 2182-2192 | 8 | Handling errors and aborts（處理錯誤與中止） | `ch8-handling-errors-and-aborts` | 311–312 | 287–288 | 要會用 | 要會用 |
| 2528-2537 | 8 | Exactly-Once Message Processing Revisited（再談恰好一次訊息處理） | `ch8-exactly-once-message-processing-revisited` | 358–359 | 334–335 | 要會用 | 要會用 |
| 4246-4277 | 13 | The End-to-End Argument for Databases（資料庫的端到端論證） | `ch13-the-end-to-end-argument-for-databases` | 586–590 | 562–566 | 要會用 | 要會用 |

### T5 存了卻看不到：複製延遲與寫後讀一致性

| 筆記行 | 章 | 段落 | 段落 id | PDF 頁 | 印刷頁 | 產品 | 平台 |
|---|---|---|---|---|---|---|---|
| 1630-1635 | 6 | Problems with Replication Lag（複製延遲的問題） | `ch6-problems-with-replication-lag` | 233 | 209 | 要會用 | 要會用 |
| 1636-1647 | 6 | Reading your own writes（寫後讀一致性） | `ch6-reading-your-own-writes` | 234–235 | 210–211 | 要會用 | 要會用 |

### T6 兩人同時改：遺失更新與衝突寫入

| 筆記行 | 章 | 段落 | 段落 id | PDF 頁 | 印刷頁 | 產品 | 平台 |
|---|---|---|---|---|---|---|---|
| 2261-2264 | 8 | Preventing Lost Updates（防止遺失更新） | `ch8-preventing-lost-updates` | 323 | 299 | 要會用 | 要會用 |
| 1714-1754 | 6 | Dealing with Conflicting Writes（處理衝突寫入） | `ch6-dealing-with-conflicting-writes` | 246–253 | 222–229 | 要會用 | 要會用 |

### T7 不能重複：約束由誰、在什麼時候擋

| 筆記行 | 章 | 段落 | 段落 id | PDF 頁 | 印刷頁 | 產品 | 平台 |
|---|---|---|---|---|---|---|---|
| 2134-2139 | 8 | 一致性（Consistency） | `ch8-consistency` | 304–305 | 280–281 | 要會用 | 要能問 |
| 2303-2308 | 8 | More examples of write skew（更多寫偏斜例子） | `ch8-more-examples-of-write-skew` | 329–330 | 305–306 | 要會用 | 要會用 |
| 4278-4307 | 13 | Enforcing Constraints（強制約束） | `ch13-enforcing-constraints` | 590–594 | 566–570 | 要會用 | 要會用 |
| 3078-3091 | 10 | Relying on Linearizability（何時需要線性一致性） | `ch10-relying-on-linearizability` | 432–435 | 408–411 | 要會用 | 要會用 |

### T8 晚一點看到 vs 永久錯誤：及時性與完整性

| 筆記行 | 章 | 段落 | 段落 id | PDF 頁 | 印刷頁 | 產品 | 平台 |
|---|---|---|---|---|---|---|---|
| 4308-4350 | 13 | Timeliness and Integrity（及時性與完整性） | `ch13-timeliness-and-integrity` | 595–599 | 571–575 | 要會用 | 要會用 |
| 4409-4416 | 13 | 怎麼選（判準） | `ch13-how-to-choose` | 565–602 | 541–578 | 要會用 | 要會用 |

### T9 新舊版本共存與 API 變更

| 筆記行 | 章 | 段落 | 段落 id | PDF 頁 | 印刷頁 | 產品 | 平台 |
|---|---|---|---|---|---|---|---|
| 1229-1241 | 5 | 為什麼新舊版本會共存（章首） | `ch5-intro-why-versions-coexist` | 185–187 | 161–163 | 要會用 | 要會用 |
| 1429-1436 | 5 | RPC 的資料編碼與演進（Data encoding and evolution for RPC） | `ch5-data-encoding-and-evolution-for-rpc` | 210 | 186 | 要會用 | 要會用 |

### T10 遷移：舊資料、行為變更與退路

| 筆記行 | 章 | 段落 | 段落 id | PDF 頁 | 印刷頁 | 產品 | 平台 |
|---|---|---|---|---|---|---|---|
| 527-532 | 2 | Evolvability: Making Change Easy（可演進性：讓改變容易） | `ch2-evolvability-making-change-easy` | 79–80 | 55–56 | 要會用 | 要會用 |
| 1374-1382 | 5 | 不同時間寫入的值（Different values written at different times） | `ch5-different-values-written-at-different-times` | 203 | 179 | 要會用 | 要會用 |
| 4108-4127 | 13 | Batch and Stream Processing（批次與串流處理） | `ch13-batch-and-stream-processing` | 568–570 | 544–546 | 要會用 | 要會用 |

### T11 多租戶：隔離、還原與跨租戶功能

| 筆記行 | 章 | 段落 | 段落 id | PDF 頁 | 印刷頁 | 產品 | 平台 |
|---|---|---|---|---|---|---|---|
| 1935-1950 | 7 | Sharding for Multitenancy（多租戶分片） | `ch7-sharding-for-multitenancy` | 278–279 | 254–255 | 要會用 | 要會用 |

### T12 法律與隱私：存什麼、存多久、怎麼刪

| 筆記行 | 章 | 段落 | 段落 id | PDF 頁 | 印刷頁 | 產品 | 平台 |
|---|---|---|---|---|---|---|---|
| 259-270 | 1 | Data Systems, Law, and Society（資料系統、法律與社會） | `ch1-data-systems-law-and-society` | 48–49 | 24–25 | 要會用 | 要會用 |
| 4517-4525 | 14 | Legislation and Self-Regulation（立法與自律） | `ch14-legislation-and-self-regulation` | 620–621 | 596–597 | 要能問 | 要會用 |

### T0 記錄系統與衍生資料、正規化

| 筆記行 | 章 | 段落 | 段落 id | PDF 頁 | 印刷頁 | 產品 | 平台 |
|---|---|---|---|---|---|---|---|
| 144-152 | 1 | Systems of Record and Derived Data（記錄系統與衍生資料） | `ch1-systems-of-record-and-derived-data` | 35 | 11 | 要會用 | 要會用 |
| 628-634 | 3 | Normalization, Denormalization, and Joins（正規化、反正規化與 join） | `ch3-normalization-denormalization-and-joins` | 96–97 | 72–73 | 要會用 | 要能問 |

### Q1 營運資料與分析資料分開；資料倉儲

| 筆記行 | 章 | 段落 | 段落 id | PDF 頁 | 印刷頁 | 產品 | 平台 |
|---|---|---|---|---|---|---|---|
| 84-94 | 1 | Operational Versus Analytical Systems（營運系統 vs. 分析系統） | `ch1-operational-versus-analytical-systems` | 27–28 | 3–4 | 要能問 | 要會用 |
| 116-130 | 1 | Data Warehousing（資料倉儲） | `ch1-data-warehousing` | 31–33 | 7–9 | 要能問 | 要會用 |

### Q2 雲端 vs 自建；微服務與 serverless

| 筆記行 | 章 | 段落 | 段落 id | PDF 頁 | 印刷頁 | 產品 | 平台 |
|---|---|---|---|---|---|---|---|
| 159-174 | 1 | Pros and Cons of Cloud Services（雲端服務的優缺點） | `ch1-pros-and-cons-of-cloud-services` | 37–38 | 13–14 | 要能問 | 要會用 |
| 232-245 | 1 | Microservices and Serverless（微服務與無伺服器） | `ch1-microservices-and-serverless` | 45–46 | 21–22 | 要能問 | 要會用 |

### Q3 先描述負載再談擴展；過載為何回不來

| 筆記行 | 章 | 段落 | 段落 id | PDF 頁 | 印刷頁 | 產品 | 平台 |
|---|---|---|---|---|---|---|---|
| 466-472 | 2 | Scalability（可擴展性） | `ch2-scalability` | 73–74 | 49–50 | 要能問 | 要會用 |
| 473-481 | 2 | Understanding Load（理解負載） | `ch2-understanding-load` | 74–75 | 50–51 | 要能問 | 要會用 |
| 491-496 | 2 | Principles for Scalability（可擴展性原則） | `ch2-principles-for-scalability` | 76 | 52 | 要能問 | 要會用 |
| 367-374 | 2 | When an Overloaded System Won't Recover（過載系統為何無法恢復） | `ch2-when-an-overloaded-system-won-t-recover` | 62 | 38 | 要能問 | 要會用 |
| 348-358 | 2 | Materializing and Updating Timelines（物化與更新時間軸） | `ch2-materializing-and-updating-timelines` | 59–60 | 35–36 | 要能問 | 要會用 |

### Q4 容錯與可營運性

| 筆記行 | 章 | 段落 | 段落 id | PDF 頁 | 印刷頁 | 產品 | 平台 |
|---|---|---|---|---|---|---|---|
| 417-423 | 2 | Fault Tolerance（容錯） | `ch2-fault-tolerance` | 67–68 | 43–44 | 要能問 | 要會用 |
| 506-517 | 2 | Operability: Making Life Easy for Operations（可營運性：讓營運輕鬆） | `ch2-operability-making-life-easy-for-operations` | 77–78 | 53–54 | 懂名詞 | 要會用 |

### Q5 schema 的彈性、優點與正規化取捨

| 筆記行 | 章 | 段落 | 段落 id | PDF 頁 | 印刷頁 | 產品 | 平台 |
|---|---|---|---|---|---|---|---|
| 635-642 | 3 | Trade-offs of normalization（正規化的取捨） | `ch3-trade-offs-of-normalization` | 97–98 | 73–74 | 要能問 | 要會用 |
| 674-684 | 3 | Schema flexibility in the document model（文件模型的 schema 彈性） | `ch3-schema-flexibility-in-the-document-model` | 104–106 | 80–82 | 要能問 | 要會用 |
| 1343-1358 | 5 | The Merits of Schemas（schema 的優點） | `ch5-the-merits-of-schemas` | 201–202, 216 | 177–178, 192 | 懂名詞 | 要會用 |

### Q6 事件溯源、CQRS、物化視圖

| 筆記行 | 章 | 段落 | 段落 id | PDF 頁 | 印刷頁 | 產品 | 平台 |
|---|---|---|---|---|---|---|---|
| 810-819 | 3 | Event Sourcing and CQRS（事件溯源與 CQRS） | `ch3-event-sourcing-and-cqrs` | 125–127 | 101–103 | 要能問 | 要會用 |
| 829-833 | 3 | 缺點（p.128） | `ch3-event-sourcing-drawbacks` | 128 | 104 | 要能問 | 要會用 |
| 1121-1129 | 4 | Materialized Views and Data Cubes（物化視圖與資料立方體） | `ch4-materialized-views-and-data-cubes` | 167–169 | 143–145 | 要能問 | 要會用 |
| 919-927 | 4 | Storage and Indexing for OLTP（OLTP 的儲存與索引） | `ch4-storage-and-indexing-for-oltp` | 140–141 | 116–117 | 要能問 | 要會用 |

### Q7 複製：同步／非同步、備份、停機、跨地區

| 筆記行 | 章 | 段落 | 段落 id | PDF 頁 | 印刷頁 | 產品 | 平台 |
|---|---|---|---|---|---|---|---|
| 1540-1555 | 6 | 前言：為什麼複製、與備份的關係（Replication and Backups） | `ch6-intro-replication-and-backups` | 221–222 | 197–198 | 要能問 | 要會用 |
| 1566-1573 | 6 | Synchronous Versus Asynchronous Replication（同步與非同步複製） | `ch6-synchronous-versus-asynchronous-replication` | 224–225 | 200–201 | 要能問 | 要會用 |
| 1596-1612 | 6 | Handling Node Outages（處理節點停機） | `ch6-handling-node-outages` | 228–230 | 204–206 | 要能問 | 要會用 |
| 1663-1669 | 6 | Solutions for Replication Lag（複製延遲的解法） | `ch6-solutions-for-replication-lag` | 238–239 | 214–215 | 要能問 | 要會用 |
| 1675-1689 | 6 | Geographically Distributed Operation（地理分散運作） | `ch6-geographically-distributed-operation` | 240–242 | 216–218 | 要能問 | 要會用 |
| 1899-1901 | 6 | 怎麼選（判準） | `ch6-how-to-choose` | 241–260 | 217–236 | 要能問 | 要會用 |
| 2150-2161 | 8 | 側欄：Replication and Durability（複製與持久性） | `ch8-replication-and-durability` | 307–308 | 283–284 | 懂名詞 | 要會用 |

### Q8 分片與再平衡

| 筆記行 | 章 | 段落 | 段落 id | PDF 頁 | 印刷頁 | 產品 | 平台 |
|---|---|---|---|---|---|---|---|
| 1926-1934 | 7 | Pros and Cons of Sharding（分片的優缺點） | `ch7-pros-and-cons-of-sharding` | 277–278 | 253–254 | 要能問 | 要會用 |
| 2019-2026 | 7 | Operations: Automatic Versus Manual Rebalancing（運維：自動與手動再平衡） | `ch7-operations-automatic-versus-manual-rebalancing` | 288–289 | 264–265 | 要能問 | 要會用 |

### Q9 隔離等級怎麼選

| 筆記行 | 章 | 段落 | 段落 id | PDF 頁 | 印刷頁 | 產品 | 平台 |
|---|---|---|---|---|---|---|---|
| 2221-2231 | 8 | Snapshot Isolation and Repeatable Read（快照隔離與可重複讀） | `ch8-snapshot-isolation-and-repeatable-read` | 317–319 | 293–295 | 要能問 | 要會用 |
| 2600-2620 | 8 | 怎麼選（判準） | `ch8-how-to-choose` | 311–361 | 287–337 | 要能問 | 要會用 |

### Q10 逾時設定、時間戳排序、fencing

| 筆記行 | 章 | 段落 | 段落 id | PDF 頁 | 印刷頁 | 產品 | 平台 |
|---|---|---|---|---|---|---|---|
| 2690-2697 | 9 | Timeouts and Unbounded Delays（逾時與無上限延遲） | `ch9-timeouts-and-unbounded-delays` | 376–377 | 352–353 | 要能問 | 要會用 |
| 2769-2780 | 9 | Timestamps for ordering events（用時間戳排序事件） | `ch9-timestamps-for-ordering-events` | 386–388 | 362–364 | 要能問 | 要會用 |
| 2864-2875 | 9 | Fencing off zombies and delayed requests（隔離殭屍與延遲請求） | `ch9-fencing-off-zombies-and-delayed-requests` | 398–400 | 374–376 | 懂名詞 | 要會用 |
| 2974-2979 | 9 | Summary（總結） | `ch9-summary` | 412–413 | 388–389 | 要能問 | 要會用 |
| 3011-3018 | 9 | 怎麼選（判準） | `ch9-how-to-choose` | 376–411 | 352–387 | 要能問 | 要會用 |

### Q11 線性一致的代價與協調服務

| 筆記行 | 章 | 段落 | 段落 id | PDF 頁 | 印刷頁 | 產品 | 平台 |
|---|---|---|---|---|---|---|---|
| 3038-3043 | 10 | 章首：兩種處理複本不一致的哲學 | `ch10-intro-two-philosophies` | 425–426 | 401–402 | 要能問 | 要會用 |
| 3109-3127 | 10 | The Cost of Linearizability（線性一致性的代價） | `ch10-the-cost-of-linearizability` | 437–441 | 413–417 | 要能問 | 要會用 |
| 3284-3304 | 10 | Coordination Services（協調服務） | `ch10-coordination-services` | 461–464 | 437–440 | 懂名詞 | 要會用 |
| 3339-3343 | 10 | 怎麼選（判準） | `ch10-how-to-choose` | 433–467 | 409–443 | 要能問 | 要會用 |

### Q12 資料流、訊息代理、持久執行

| 筆記行 | 章 | 段落 | 段落 id | PDF 頁 | 印刷頁 | 產品 | 平台 |
|---|---|---|---|---|---|---|---|
| 1370-1373 | 5 | Dataflow Through Databases（經由資料庫的資料流） | `ch5-dataflow-through-databases` | 202–203 | 178–179 | 要能問 | 要會用 |
| 1437-1449 | 5 | Durable Execution and Workflows（持久執行與工作流程） | `ch5-durable-execution-and-workflows` | 211–213 | 187–189 | 要能問 | 要會用 |
| 1460-1468 | 5 | 訊息代理（Message brokers） | `ch5-message-brokers` | 214–215 | 190–191 | 懂名詞 | 要會用 |
| 1514-1519 | 5 | 怎麼選（判準） | `ch5-how-to-choose` | 186–214 | 162–190 | 要能問 | 要會用 |
| 3669-3714 | 12 | Messaging Systems（訊息系統） | `ch12-messaging-systems` | 513–519 | 489–495 | 要能問 | 要會用 |
| 3715-3763 | 12 | Log-Based Message Brokers（日誌式訊息代理） | `ch12-log-based-message-brokers` | 519–524 | 495–500 | 要能問 | 要會用 |

### Q13 讓系統同步：CDC、不可變、組合工具

| 筆記行 | 章 | 段落 | 段落 id | PDF 頁 | 印刷頁 | 產品 | 平台 |
|---|---|---|---|---|---|---|---|
| 3769-3775 | 12 | Keeping Systems in Sync（讓系統保持同步） | `ch12-keeping-systems-in-sync` | 525–526 | 501–502 | 要能問 | 要會用 |
| 3776-3816 | 12 | Change Data Capture（變更資料擷取） | `ch12-change-data-capture` | 527–532 | 503–508 | 要能問 | 要會用 |
| 3817-3846 | 12 | State, Streams, and Immutability（狀態、串流與不可變性） | `ch12-state-streams-and-immutability` | 532–537 | 508–513 | 要能問 | 要會用 |
| 4077-4107 | 13 | Combining Specialized Tools by Deriving Data（以衍生資料組合專門工具） | `ch13-combining-specialized-tools-by-deriving-data` | 564–568 | 540–544 | 要能問 | 要會用 |
| 4141-4167 | 13 | Composing Data Storage Technologies（組合資料儲存技術） | `ch13-composing-data-storage-technologies` | 571–575 | 547–551 | 懂名詞 | 要會用 |

### Q14 批次、ETL、提供衍生資料

| 筆記行 | 章 | 段落 | 段落 id | PDF 頁 | 印刷頁 | 產品 | 平台 |
|---|---|---|---|---|---|---|---|
| 3360-3377 | 11 | 章首：線上系統與批次處理 | `ch11-intro-online-and-batch` | 475–477 | 451–453 | 要能問 | 要會用 |
| 3564-3571 | 11 | Extract–Transform–Load（ETL） | `ch11-extract-transform-load` | 500–501 | 476–477 | 懂名詞 | 要會用 |
| 3590-3604 | 11 | Serving Derived Data（提供衍生資料） | `ch11-serving-derived-data` | 503–505 | 479–481 | 要能問 | 要會用 |
| 3639-3645 | 11 | 怎麼選（判準） | `ch11-how-to-choose` | 475–500 | 451–476 | 要能問 | 要會用 |

### Q15 串流：時間、join、容錯

| 筆記行 | 章 | 段落 | 段落 id | PDF 頁 | 印刷頁 | 產品 | 平台 |
|---|---|---|---|---|---|---|---|
| 3889-3925 | 12 | Reasoning About Time（關於時間的推理） | `ch12-reasoning-about-time` | 542–546 | 518–522 | 要能問 | 要會用 |
| 3926-3974 | 12 | Stream Joins（串流 join） | `ch12-stream-joins` | 547–550 | 523–526 | 要能問 | 要會用 |
| 3975-4004 | 12 | Fault Tolerance（容錯） | `ch12-fault-tolerance` | 550–553 | 526–529 | 要能問 | 要會用 |
| 4044-4051 | 12 | 怎麼選（判準） | `ch12-how-to-choose` | 515–552 | 491–528 | 要能問 | 要會用 |

### Q16 信任但要驗證：持續稽核

| 筆記行 | 章 | 段落 | 段落 id | PDF 頁 | 印刷頁 | 產品 | 平台 |
|---|---|---|---|---|---|---|---|
| 4351-4380 | 13 | Trust, but Verify（信任，但要驗證） | `ch13-trust-but-verify` | 599–602 | 575–578 | 要能問 | 要會用 |

## 依章節：全書每一段的去處


### 第 1 章 Trade-Offs in Data Systems Architecture（資料系統架構中的取捨）

| 筆記行 | 段落 | 產品 | 平台 | 去處 |
|---|---|---|---|---|
| 71-77 | 引言：什麼是資料密集型應用（data-intensive application） |  |  | 不收（懂名詞／跳過） |
| 78-83 | 　術語：前端與後端（Terminology: Frontends and Backends） |  |  | 不收（懂名詞／跳過） |
| 84-94 | Operational Versus Analytical Systems（營運系統 vs. 分析系統） | 要能問 | 要會用 | Q1 主題頁 |
| 95-115 | 　Characterizing Transaction Processing and Analytics（交易處理與分析的特徵） | 要能問 | 要能問 | 一行版（這版不做） |
| 116-130 | 　Data Warehousing（資料倉儲） | 要能問 | 要會用 | Q1 主題頁 |
| 131-138 | 　　From data warehouse to data lake（從資料倉儲到資料湖） | 懂名詞 | 要能問 | 一行版（這版不做） |
| 139-143 | 　　Beyond the data lake（資料湖之後） | 懂名詞 | 要能問 | 一行版（這版不做） |
| 144-152 | 　Systems of Record and Derived Data（記錄系統與衍生資料） | 要會用 | 要會用 | T0 主題頁 |
| 153-158 | Cloud Versus Self-Hosting（雲端 vs. 自行託管） | 懂名詞 | 要能問 | 一行版（這版不做） |
| 159-174 | 　Pros and Cons of Cloud Services（雲端服務的優缺點） | 要能問 | 要會用 | Q2 主題頁 |
| 175-184 | 　Cloud Native System Architecture（雲原生系統架構） | 懂名詞 | 要能問 | 一行版（這版不做） |
| 185-192 | 　　Layering of cloud services（雲端服務的分層） | 跳過 | 要能問 | 一行版（這版不做） |
| 193-200 | 　　Separation of storage and compute（儲存與運算分離） | 跳過 | 要能問 | 一行版（這版不做） |
| 201-210 | 　Operations in the Cloud Era（雲端時代的營運） | 懂名詞 | 要能問 | 一行版（這版不做） |
| 211-223 | Distributed Versus Single-Node Systems（分散式 vs. 單節點系統） | 懂名詞 | 要能問 | 一行版（這版不做） |
| 224-231 | 　Problems with Distributed Systems（分散式系統的問題） | 要會用 | 要會用 | T3 主題頁 |
| 232-245 | 　Microservices and Serverless（微服務與無伺服器） | 要能問 | 要會用 | Q2 主題頁 |
| 246-258 | 　Cloud Computing Versus Supercomputing（雲端運算 vs. 超級電腦） |  |  | 不收（懂名詞／跳過） |
| 259-270 | Data Systems, Law, and Society（資料系統、法律與社會） | 要會用 | 要會用 | T12 主題頁 |
| 271-273 | Summary（本章小結） |  |  | 不收（懂名詞／跳過） |
| 274-298 | 名詞 |  |  | 不收（懂名詞／跳過） |
| 299-303 | 怎麼選（判準） | 要能問 | 要能問 | 一行版（這版不做） |
| 304-319 | 容易誤解 | 懂名詞 | 要能問 | 一行版（這版不做） |

### 第 2 章 Defining Nonfunctional Requirements（定義非功能性需求）

| 筆記行 | 段落 | 產品 | 平台 | 去處 |
|---|---|---|---|---|
| 320-323 | 引言：功能性與非功能性需求 | 要會用 | 要會用 | T1 主題頁 |
| 324-329 | Case Study: Social Network Home Timelines（案例研究：社群網路首頁時間軸） | 懂名詞 | 要能問 | 一行版（這版不做） |
| 330-347 | 　Representing Users, Posts, and Follows（表示使用者、貼文與追蹤關係） | 要能問 | 要能問 | 一行版（這版不做） |
| 348-358 | 　Materializing and Updating Timelines（物化與更新時間軸） | 要能問 | 要會用 | Q3 主題頁 |
| 359-366 | Describing Performance（描述效能） | 要能問 | 要能問 | 一行版（這版不做） |
| 367-374 | 　When an Overloaded System Won't Recover（過載系統為何無法恢復） | 要能問 | 要會用 | Q3 主題頁 |
| 375-384 | 　Latency and Response Time（延遲與回應時間） | 懂名詞 | 要能問 | 一行版（這版不做） |
| 385-391 | 　Average, Median, and Percentiles（平均數、中位數與百分位數） | 要會用 | 要會用 | T2 主題頁 |
| 392-398 | 　The User Impact of Response Times（回應時間對使用者的影響） | 要能問 | 懂名詞 | 一行版（這版不做） |
| 399-403 | 　Use of Response Time Metrics（回應時間指標的用法） | 要會用 | 要會用 | T2 主題頁 |
| 404-409 | 　Computing Percentiles（計算百分位數） | 懂名詞 | 要能問 | 一行版（這版不做） |
| 410-416 | Reliability and Fault Tolerance（可靠性與容錯） | 要能問 | 要能問 | 一行版（這版不做） |
| 417-423 | 　Fault Tolerance（容錯） | 要能問 | 要會用 | Q4 主題頁 |
| 424-433 | 　Hardware and Software Faults（硬體與軟體故障） |  |  | 不收（懂名詞／跳過） |
| 434-440 | 　　Tolerating hardware faults through redundancy（以冗餘容忍硬體故障） | 懂名詞 | 要能問 | 一行版（這版不做） |
| 441-451 | 　　Software faults（軟體故障） | 懂名詞 | 要能問 | 一行版（這版不做） |
| 452-459 | 　Humans and Reliability（人與可靠性） | 要會用 | 要會用 | T1 主題頁 |
| 460-465 | 　How Important Is Reliability?（可靠性有多重要？） | 要會用 | 要能問 | T1 主題頁 |
| 466-472 | Scalability（可擴展性） | 要能問 | 要會用 | Q3 主題頁 |
| 473-481 | 　Understanding Load（理解負載） | 要能問 | 要會用 | Q3 主題頁 |
| 482-490 | 　Shared-Memory, Shared-Disk, and Shared-Nothing Architectures（共享記憶體、共享磁碟與無共享架構） | 懂名詞 | 要能問 | 一行版（這版不做） |
| 491-496 | 　Principles for Scalability（可擴展性原則） | 要能問 | 要會用 | Q3 主題頁 |
| 497-505 | Maintainability（可維護性） | 要能問 | 要能問 | 一行版（這版不做） |
| 506-517 | 　Operability: Making Life Easy for Operations（可營運性：讓營運輕鬆） | 懂名詞 | 要會用 | Q4 主題頁 |
| 518-526 | 　Simplicity: Managing Complexity（簡單性：管理複雜度） | 要能問 | 要能問 | 一行版（這版不做） |
| 527-532 | 　Evolvability: Making Change Easy（可演進性：讓改變容易） | 要會用 | 要會用 | T10 主題頁 |
| 533-535 | Summary（本章小結） |  |  | 不收（懂名詞／跳過） |
| 536-573 | 名詞 |  |  | 不收（懂名詞／跳過） |
| 574-579 | 怎麼選（判準） | 要能問 | 要能問 | 一行版（這版不做） |
| 580-599 | 容易誤解 | 要能問 | 要能問 | 一行版（這版不做） |

### 第 3 章 Data Models and Query Languages（資料模型與查詢語言）

| 筆記行 | 段落 | 產品 | 平台 | 去處 |
|---|---|---|---|---|
| 600-604 | 導論：資料模型的分層與宣告式查詢語言（Terminology: Declarative Query Languages） |  |  | 不收（懂名詞／跳過） |
| 605-610 | Relational Versus Document Models（關聯式模型與文件模型） |  |  | 不收（懂名詞／跳過） |
| 611-620 | 　The Object-Relational Mismatch（物件與關聯的不匹配） | 要能問 | 要能問 | 一行版（這版不做） |
| 621-627 | 　一對多關係與文件模型（The document data model for one-to-many relationships） | 懂名詞 | 要能問 | 一行版（這版不做） |
| 628-634 | 　Normalization, Denormalization, and Joins（正規化、反正規化與 join） | 要會用 | 要能問 | T0 主題頁 |
| 635-642 | 　Trade-offs of normalization（正規化的取捨） | 要能問 | 要會用 | Q5 主題頁 |
| 643-650 | 　社群網路案例中的反正規化（Denormalization in the social networking case study） | 要能問 | 要能問 | 一行版（這版不做） |
| 651-657 | 　Many-to-One and Many-to-Many Relationships（多對一與多對多關係） | 要能問 | 要能問 | 一行版（這版不做） |
| 658-667 | 　Stars and Snowflakes: Schemas for Analytics（星狀與雪花：分析用 schema） | 懂名詞 | 要能問 | 一行版（這版不做） |
| 668-673 | 　When to Use Which Model（何時用哪種模型） | 要能問 | 要能問 | 一行版（這版不做） |
| 674-684 | 　Schema flexibility in the document model（文件模型的 schema 彈性） | 要能問 | 要會用 | Q5 主題頁 |
| 685-689 | 　Data locality for reads and writes（讀寫的資料局部性） |  |  | 不收（懂名詞／跳過） |
| 690-696 | 　Query languages for documents（文件的查詢語言） |  |  | 不收（懂名詞／跳過） |
| 697-701 | 　Convergence of document and relational databases（文件與關聯式的匯流） |  |  | 不收（懂名詞／跳過） |
| 702-709 | Graph-Like Data Models（類圖資料模型） | 懂名詞 | 要能問 | 一行版（這版不做） |
| 710-721 | 　Property Graphs（屬性圖） |  |  | 不收（懂名詞／跳過） |
| 722-734 | 　The Cypher Query Language（Cypher 查詢語言） |  |  | 不收（懂名詞／跳過） |
| 735-741 | 　Graph Queries in SQL（用 SQL 做圖查詢） |  |  | 不收（懂名詞／跳過） |
| 742-749 | 　Triple Stores and SPARQL（三元組儲存與 SPARQL） |  |  | 不收（懂名詞／跳過） |
| 750-753 | 　The Semantic Web（語意網） |  |  | 不收（懂名詞／跳過） |
| 754-757 | 　The RDF data model（RDF 資料模型） |  |  | 不收（懂名詞／跳過） |
| 758-775 | 　The SPARQL query language（SPARQL 查詢語言） |  |  | 不收（懂名詞／跳過） |
| 776-799 | 　Datalog: Recursive Relational Queries（Datalog：遞迴關聯查詢） |  |  | 不收（懂名詞／跳過） |
| 800-809 | 　GraphQL | 要能問 | 要能問 | 一行版（這版不做） |
| 810-819 | Event Sourcing and CQRS（事件溯源與 CQRS） | 要能問 | 要會用 | Q6 主題頁 |
| 820-828 | 　優點（p.127–128） | 要能問 | 要能問 | 一行版（這版不做） |
| 829-833 | 　缺點（p.128） | 要能問 | 要會用 | Q6 主題頁 |
| 834-837 | 　實作（p.129） | 跳過 | 要能問 | 一行版（這版不做） |
| 838-848 | DataFrames, Matrices, and Arrays（DataFrame、矩陣與陣列） |  |  | 不收（懂名詞／跳過） |
| 849-852 | Summary（本章總結） |  |  | 不收（懂名詞／跳過） |
| 853-893 | 名詞 |  |  | 不收（懂名詞／跳過） |
| 894-902 | 怎麼選（判準） | 要能問 | 要能問 | 一行版（這版不做） |
| 903-914 | 容易誤解 | 懂名詞 | 要能問 | 一行版（這版不做） |

### 第 4 章 Storage and Retrieval（儲存與檢索）

| 筆記行 | 段落 | 產品 | 平台 | 去處 |
|---|---|---|---|---|
| 915-918 | 為什麼應用開發者要懂儲存引擎（章首） |  |  | 不收（懂名詞／跳過） |
| 919-927 | Storage and Indexing for OLTP（OLTP 的儲存與索引） | 要能問 | 要會用 | Q6 主題頁 |
| 928-929 | Log-Structured Storage（日誌結構儲存） |  |  | 不收（懂名詞／跳過） |
| 930-937 | 　記憶體雜湊索引 |  |  | 不收（懂名詞／跳過） |
| 938-943 | 　SSTable 檔案格式 |  |  | 不收（懂名詞／跳過） |
| 944-959 | 　建構與合併 SSTable（LSM 演算法） |  |  | 不收（懂名詞／跳過） |
| 960-966 | 　布隆過濾器（Bloom filter） |  |  | 不收（懂名詞／跳過） |
| 967-976 | 　壓實策略（compaction strategies） |  |  | 不收（懂名詞／跳過） |
| 977-980 | Embedded Storage Engines（嵌入式儲存引擎） | 懂名詞 | 要能問 | 一行版（這版不做） |
| 981-990 | B-Trees（B 樹） |  |  | 不收（懂名詞／跳過） |
| 991-996 | 　讓 B-tree 可靠（Making B-trees reliable） |  |  | 不收（懂名詞／跳過） |
| 997-1002 | 　B-tree 變體（Using B-tree variants） |  |  | 不收（懂名詞／跳過） |
| 1003-1005 | Comparing B-Trees and LSM-Trees（B-tree 與 LSM-tree 的比較） | 跳過 | 要能問 | 一行版（這版不做） |
| 1006-1011 | 　讀取效能（Read performance） |  |  | 不收（懂名詞／跳過） |
| 1012-1018 | 　循序寫與隨機寫（Sequential versus random writes） |  |  | 不收（懂名詞／跳過） |
| 1019-1025 | 　寫入放大（Write amplification） | 跳過 | 要能問 | 一行版（這版不做） |
| 1026-1042 | 　磁碟空間使用（Disk space usage） | 懂名詞 | 要能問 | 一行版（這版不做） |
| 1043-1047 | Multicolumn and Secondary Indexes（多欄與次要索引） |  |  | 不收（懂名詞／跳過） |
| 1048-1053 | 　在索引中存放值（Storing Values Within the Index） |  |  | 不收（懂名詞／跳過） |
| 1054-1060 | Keeping Everything in Memory（全部放在記憶體） | 懂名詞 | 要能問 | 一行版（這版不做） |
| 1061-1065 | Data Storage for Analytics（分析用的資料儲存） |  |  | 不收（懂名詞／跳過） |
| 1066-1077 | Cloud Data Warehouses（雲端資料倉儲） | 跳過 | 要能問 | 一行版（這版不做） |
| 1078-1087 | Column-Oriented Storage（欄式儲存） | 懂名詞 | 要能問 | 一行版（這版不做） |
| 1088-1097 | 　欄壓縮（Column compression） |  |  | 不收（懂名詞／跳過） |
| 1098-1103 | 　欄式儲存的排序（Sort order in column storage） |  |  | 不收（懂名詞／跳過） |
| 1104-1108 | 　寫入欄式儲存（Writing to column-oriented storage） |  |  | 不收（懂名詞／跳過） |
| 1109-1120 | Query Execution: Compilation and Vectorization（查詢執行：編譯與向量化） |  |  | 不收（懂名詞／跳過） |
| 1121-1129 | Materialized Views and Data Cubes（物化視圖與資料立方體） | 要能問 | 要會用 | Q6 主題頁 |
| 1130-1136 | Multidimensional and Full-Text Indexes（多維與全文索引） | 要能問 | 要能問 | 一行版（這版不做） |
| 1137-1145 | Full-Text Search（全文檢索） | 要能問 | 要能問 | 一行版（這版不做） |
| 1146-1161 | Vector Embeddings（向量嵌入） | 要能問 | 要能問 | 一行版（這版不做） |
| 1162-1164 | Summary（本章小結） |  |  | 不收（懂名詞／跳過） |
| 1165-1203 | 名詞 |  |  | 不收（懂名詞／跳過） |
| 1204-1209 | 怎麼選（判準） | 要能問 | 要能問 | 一行版（這版不做） |
| 1210-1228 | 容易誤解 | 懂名詞 | 要能問 | 一行版（這版不做） |

### 第 5 章 Encoding and Evolution（編碼與演進）

| 筆記行 | 段落 | 產品 | 平台 | 去處 |
|---|---|---|---|---|
| 1229-1241 | 為什麼新舊版本會共存（章首） | 要會用 | 要會用 | T9 主題頁 |
| 1242-1247 | Formats for Encoding Data（資料編碼格式） |  |  | 不收（懂名詞／跳過） |
| 1248-1256 | Language-Specific Formats（語言專屬格式） |  |  | 不收（懂名詞／跳過） |
| 1257-1266 | JSON, XML, and Binary Variants（JSON、XML 與二進位變體） | 要能問 | 要能問 | 一行版（這版不做） |
| 1267-1273 | 　JSON Schema | 懂名詞 | 要能問 | 一行版（這版不做） |
| 1274-1284 | 　二進位編碼（Binary encodings） |  |  | 不收（懂名詞／跳過） |
| 1285-1293 | Protocol Buffers |  |  | 不收（懂名詞／跳過） |
| 1294-1303 | 　欄位標籤與 schema 演進（Field tags and schema evolution） | 懂名詞 | 要能問 | 一行版（這版不做） |
| 1304-1311 | Avro |  |  | 不收（懂名詞／跳過） |
| 1312-1320 | 　寫入者 schema 與讀取者 schema（The writer's schema and the reader's schema） |  |  | 不收（懂名詞／跳過） |
| 1321-1329 | 　Schema 演進規則（Schema evolution rules） | 跳過 | 要能問 | 一行版（這版不做） |
| 1330-1336 | 　寫入者 schema 從哪來？（But what is the writer's schema?） | 跳過 | 要能問 | 一行版（這版不做） |
| 1337-1342 | 　動態產生的 schema（Dynamically generated schemas） |  |  | 不收（懂名詞／跳過） |
| 1343-1358 | The Merits of Schemas（schema 的優點） | 懂名詞 | 要會用 | Q5 主題頁 |
| 1359-1369 | Modes of Dataflow（資料流動模式） | 要能問 | 要能問 | 一行版（這版不做） |
| 1370-1373 | Dataflow Through Databases（經由資料庫的資料流） | 要能問 | 要會用 | Q12 主題頁 |
| 1374-1382 | 　不同時間寫入的值（Different values written at different times） | 要會用 | 要會用 | T10 主題頁 |
| 1383-1386 | 　封存儲存（Archival storage） | 跳過 | 要能問 | 一行版（這版不做） |
| 1387-1393 | Dataflow Through Services: REST and RPC（經由服務的資料流：REST 與 RPC） | 要能問 | 要能問 | 一行版（這版不做） |
| 1394-1403 | 　網路服務（Web services） |  |  | 不收（懂名詞／跳過） |
| 1404-1414 | 　遠端程序呼叫的問題（The problems with remote procedure calls） | 要會用 | 要會用 | T3 主題頁 |
| 1415-1428 | 　負載平衡器、服務探索與服務網格（Load balancers, service discovery, and service meshes） | 懂名詞 | 要能問 | 一行版（這版不做） |
| 1429-1436 | 　RPC 的資料編碼與演進（Data encoding and evolution for RPC） | 要會用 | 要會用 | T9 主題頁 |
| 1437-1449 | Durable Execution and Workflows（持久執行與工作流程） | 要能問 | 要會用 | Q12 主題頁 |
| 1450-1459 | Event-Driven Architectures（事件驅動架構） | 要能問 | 要能問 | 一行版（這版不做） |
| 1460-1468 | 　訊息代理（Message brokers） | 懂名詞 | 要會用 | Q12 主題頁 |
| 1469-1474 | 　分散式 actor 框架（Distributed actor frameworks） |  |  | 不收（懂名詞／跳過） |
| 1475-1477 | Summary（本章小結） |  |  | 不收（懂名詞／跳過） |
| 1478-1513 | 名詞 |  |  | 不收（懂名詞／跳過） |
| 1514-1519 | 怎麼選（判準） | 要能問 | 要會用 | Q12 主題頁 |
| 1520-1539 | 容易誤解 | 要能問 | 要能問 | 一行版（這版不做） |

### 第 6 章 Replication（複製）

| 筆記行 | 段落 | 產品 | 平台 | 去處 |
|---|---|---|---|---|
| 1540-1555 | 前言：為什麼複製、與備份的關係（Replication and Backups） | 要能問 | 要會用 | Q7 主題頁 |
| 1556-1565 | Single-Leader Replication（單主複製） | 懂名詞 | 要能問 | 一行版（這版不做） |
| 1566-1573 | 　Synchronous Versus Asynchronous Replication（同步與非同步複製） | 要能問 | 要會用 | Q7 主題頁 |
| 1574-1582 | 　Setting Up New Followers（建立新追隨者） |  |  | 不收（懂名詞／跳過） |
| 1583-1595 | 　Databases Backed by Object Storage（以物件儲存為後盾的資料庫） | 跳過 | 要能問 | 一行版（這版不做） |
| 1596-1612 | 　Handling Node Outages（處理節點停機） | 要能問 | 要會用 | Q7 主題頁 |
| 1613-1629 | 　Implementation of Replication Logs（複製日誌的實作） | 跳過 | 要能問 | 一行版（這版不做） |
| 1630-1635 | Problems with Replication Lag（複製延遲的問題） | 要會用 | 要會用 | T5 主題頁 |
| 1636-1647 | 　Reading your own writes（寫後讀一致性） | 要會用 | 要會用 | T5 主題頁 |
| 1648-1651 | 　Regions and Availability Zones（地區與可用區） | 懂名詞 | 要能問 | 一行版（這版不做） |
| 1652-1656 | 　Monotonic reads（單調讀取） | 要能問 | 要能問 | 一行版（這版不做） |
| 1657-1662 | 　Consistent prefix reads（一致前綴讀取） | 懂名詞 | 要能問 | 一行版（這版不做） |
| 1663-1669 | 　Solutions for Replication Lag（複製延遲的解法） | 要能問 | 要會用 | Q7 主題頁 |
| 1670-1674 | Multi-Leader Replication（多主複製） | 懂名詞 | 要能問 | 一行版（這版不做） |
| 1675-1689 | 　Geographically Distributed Operation（地理分散運作） | 要能問 | 要會用 | Q7 主題頁 |
| 1690-1699 | 　Multi-leader replication topologies（多主複製拓撲） |  |  | 不收（懂名詞／跳過） |
| 1700-1713 | 　Sync Engines and Local-First Software（同步引擎與本地優先軟體） | 要能問 | 要能問 | 一行版（這版不做） |
| 1714-1754 | 　Dealing with Conflicting Writes（處理衝突寫入） | 要會用 | 要會用 | T6 主題頁 |
| 1755-1760 | Leaderless Replication（無主複製） | 跳過 | 要能問 | 一行版（這版不做） |
| 1761-1769 | 　Writing to the Database When a Node Is Down（節點停機時寫入資料庫） |  |  | 不收（懂名詞／跳過） |
| 1770-1777 | 　Using quorums for reading and writing（以法定人數讀寫） | 懂名詞 | 要能問 | 一行版（這版不做） |
| 1778-1790 | 　Understanding the limitations of quorum consistency（法定人數一致性的限制） | 懂名詞 | 要能問 | 一行版（這版不做） |
| 1791-1795 | 　Monitoring staleness（監控過時程度） | 懂名詞 | 要能問 | 一行版（這版不做） |
| 1796-1809 | 　Single-Leader Versus Leaderless Replication Performance（單主與無主複製的效能） | 跳過 | 要能問 | 一行版（這版不做） |
| 1810-1815 | 　Multi-Region Operation（多地區運作） |  |  | 不收（懂名詞／跳過） |
| 1816-1821 | 　Detecting Concurrent Writes（偵測並行寫入） | 懂名詞 | 要能問 | 一行版（這版不做） |
| 1822-1829 | 　The happens-before relation and concurrency（先發生關係與並行） | 懂名詞 | 要能問 | 一行版（這版不做） |
| 1830-1849 | 　Capturing the happens-before relationship（捕捉先發生關係） |  |  | 不收（懂名詞／跳過） |
| 1850-1855 | 　Version vectors（版本向量） |  |  | 不收（懂名詞／跳過） |
| 1856-1866 | Summary（摘要） | 懂名詞 | 要能問 | 一行版（這版不做） |
| 1867-1898 | 名詞 |  |  | 不收（懂名詞／跳過） |
| 1899-1901 | 怎麼選（判準） | 要能問 | 要會用 | Q7 主題頁 |
| 1902-1914 | 容易誤解 | 要能問 | 要能問 | 一行版（這版不做） |

### 第 7 章 Sharding（分片）

| 筆記行 | 段落 | 產品 | 平台 | 去處 |
|---|---|---|---|---|
| 1915-1920 | 前言：分片與複製（Sharding and replication） |  |  | 不收（懂名詞／跳過） |
| 1921-1925 | 　Sharding and Partitioning（分片與分區） |  |  | 不收（懂名詞／跳過） |
| 1926-1934 | Pros and Cons of Sharding（分片的優缺點） | 要能問 | 要會用 | Q8 主題頁 |
| 1935-1950 | 　Sharding for Multitenancy（多租戶分片） | 要會用 | 要會用 | T11 主題頁 |
| 1951-1955 | Sharding of Key-Value Data（鍵值資料的分片） | 懂名詞 | 要能問 | 一行版（這版不做） |
| 1956-1969 | 　Sharding by Key Range（依鍵範圍分片） | 跳過 | 要能問 | 一行版（這版不做） |
| 1970-1978 | 　Sharding by Hash of Key（依鍵的雜湊分片） |  |  | 不收（懂名詞／跳過） |
| 1979-1987 | 　Fixed number of shards（固定數量的分片） | 跳過 | 要能問 | 一行版（這版不做） |
| 1988-1997 | 　Sharding by hash range（依雜湊範圍分片） | 跳過 | 要能問 | 一行版（這版不做） |
| 1998-2008 | 　Consistent hashing（一致性雜湊） |  |  | 不收（懂名詞／跳過） |
| 2009-2018 | 　Skewed Workloads and Relieving Hot Spots（偏斜工作負載與紓解熱點） | 要能問 | 要能問 | 一行版（這版不做） |
| 2019-2026 | 　Operations: Automatic Versus Manual Rebalancing（運維：自動與手動再平衡） | 要能問 | 要會用 | Q8 主題頁 |
| 2027-2043 | Request Routing（請求路由） | 跳過 | 要能問 | 一行版（這版不做） |
| 2044-2048 | Sharding and Secondary Indexes（分片與次要索引） | 懂名詞 | 要能問 | 一行版（這版不做） |
| 2049-2059 | 　Local Secondary Indexes（本地次要索引） | 要能問 | 要能問 | 一行版（這版不做） |
| 2060-2074 | 　Global Secondary Indexes（全域次要索引） | 懂名詞 | 要能問 | 一行版（這版不做） |
| 2075-2077 | Summary（摘要） |  |  | 不收（懂名詞／跳過） |
| 2078-2095 | 名詞 |  |  | 不收（懂名詞／跳過） |
| 2096-2098 | 怎麼選（判準） | 懂名詞 | 要能問 | 一行版（這版不做） |
| 2099-2112 | 容易誤解 | 懂名詞 | 要能問 | 一行版（這版不做） |

### 第 8 章 Transactions（交易）

| 筆記行 | 段落 | 產品 | 平台 | 去處 |
|---|---|---|---|---|
| 2113-2118 | 導言（章首） |  |  | 不收（懂名詞／跳過） |
| 2119-2123 | What Exactly Is a Transaction?（交易到底是什麼） |  |  | 不收（懂名詞／跳過） |
| 2124-2128 | 　The Meaning of ACID（ACID 的意義） | 懂名詞 | 要能問 | 一行版（這版不做） |
| 2129-2133 | 　原子性（Atomicity） | 要能問 | 要能問 | 一行版（這版不做） |
| 2134-2139 | 　一致性（Consistency） | 要會用 | 要能問 | T7 主題頁 |
| 2140-2144 | 　隔離性（Isolation） | 懂名詞 | 要能問 | 一行版（這版不做） |
| 2145-2149 | 　持久性（Durability） | 懂名詞 | 要能問 | 一行版（這版不做） |
| 2150-2161 | 　側欄：Replication and Durability（複製與持久性） | 懂名詞 | 要會用 | Q7 主題頁 |
| 2162-2168 | 　Single-Object and Multi-Object Operations（單物件與多物件操作） | 懂名詞 | 要能問 | 一行版（這版不做） |
| 2169-2174 | 　Single-object writes（單物件寫入） | 懂名詞 | 要能問 | 一行版（這版不做） |
| 2175-2181 | 　The need for multi-object transactions（為何需要多物件交易） | 懂名詞 | 要能問 | 一行版（這版不做） |
| 2182-2192 | 　Handling errors and aborts（處理錯誤與中止） | 要會用 | 要會用 | T4 主題頁 |
| 2193-2199 | Weak Isolation Levels（弱隔離等級） | 要能問 | 要能問 | 一行版（這版不做） |
| 2200-2202 | 　Read Committed（讀已提交） |  |  | 不收（懂名詞／跳過） |
| 2203-2208 | 　No dirty reads（無髒讀） |  |  | 不收（懂名詞／跳過） |
| 2209-2213 | 　No dirty writes（無髒寫） |  |  | 不收（懂名詞／跳過） |
| 2214-2220 | 　Implementing read-committed（實作讀已提交） |  |  | 不收（懂名詞／跳過） |
| 2221-2231 | 　Snapshot Isolation and Repeatable Read（快照隔離與可重複讀） | 要能問 | 要會用 | Q9 主題頁 |
| 2232-2240 | 　Multiversion concurrency control（多版本並行控制） |  |  | 不收（懂名詞／跳過） |
| 2241-2250 | 　Visibility rules for observing a consistent snapshot（一致快照的可見性規則） |  |  | 不收（懂名詞／跳過） |
| 2251-2254 | 　Indexes and snapshot isolation（索引與快照隔離） |  |  | 不收（懂名詞／跳過） |
| 2255-2260 | 　Snapshot isolation, repeatable read, and naming confusion（命名混亂） | 懂名詞 | 要能問 | 一行版（這版不做） |
| 2261-2264 | 　Preventing Lost Updates（防止遺失更新） | 要會用 | 要會用 | T6 主題頁 |
| 2265-2270 | 　Atomic write operations（原子寫入操作） | 懂名詞 | 要能問 | 一行版（這版不做） |
| 2271-2275 | 　Explicit locking（顯式鎖定） | 懂名詞 | 要能問 | 一行版（這版不做） |
| 2276-2280 | 　Automatically detecting lost updates（自動偵測遺失更新） | 懂名詞 | 要能問 | 一行版（這版不做） |
| 2281-2285 | 　Conditional writes (compare-and-set)（條件寫入） | 要能問 | 要能問 | 一行版（這版不做） |
| 2286-2290 | 　Conflict resolution and replication（衝突解決與複製） | 懂名詞 | 要能問 | 一行版（這版不做） |
| 2291-2293 | 　Write Skew and Phantoms（寫偏斜與幻讀） | 要能問 | 要能問 | 一行版（這版不做） |
| 2294-2302 | 　Characterizing write skew（寫偏斜的特徵） | 懂名詞 | 要能問 | 一行版（這版不做） |
| 2303-2308 | 　More examples of write skew（更多寫偏斜例子） | 要會用 | 要會用 | T7 主題頁 |
| 2309-2317 | 　Phantoms causing write skew（幻讀導致寫偏斜） | 要能問 | 要能問 | 一行版（這版不做） |
| 2318-2332 | 　Materializing conflicts（實體化衝突） | 懂名詞 | 要能問 | 一行版（這版不做） |
| 2333-2338 | Serializability（可序列化） | 懂名詞 | 要能問 | 一行版（這版不做） |
| 2339-2345 | 　Actual Serial Execution（實際依序執行） |  |  | 不收（懂名詞／跳過） |
| 2346-2350 | 　Encapsulating transactions in stored procedures（把交易封裝在預存程序中） | 要能問 | 懂名詞 | 一行版（這版不做） |
| 2351-2360 | 　Pros and cons of stored procedures（預存程序的優缺點） | 跳過 | 要能問 | 一行版（這版不做） |
| 2361-2366 | 　Sharding（分片） |  |  | 不收（懂名詞／跳過） |
| 2367-2373 | 　Summary of serial execution（依序執行小結） |  |  | 不收（懂名詞／跳過） |
| 2374-2381 | 　Two-Phase Locking（兩階段鎖） |  |  | 不收（懂名詞／跳過） |
| 2382-2390 | 　Implementation of 2PL（2PL 的實作） |  |  | 不收（懂名詞／跳過） |
| 2391-2397 | 　Performance of 2PL（2PL 的效能） | 跳過 | 要能問 | 一行版（這版不做） |
| 2398-2405 | 　Predicate locks（謂詞鎖） |  |  | 不收（懂名詞／跳過） |
| 2406-2411 | 　Index-range locks（索引範圍鎖） |  |  | 不收（懂名詞／跳過） |
| 2412-2415 | 　Serializable Snapshot Isolation（可序列化快照隔離） | 跳過 | 要能問 | 一行版（這版不做） |
| 2416-2421 | 　Pessimistic versus optimistic concurrency control（悲觀與樂觀並行控制） | 懂名詞 | 要能問 | 一行版（這版不做） |
| 2422-2426 | 　Decisions based on an outdated premise（基於過時前提的決策） | 要能問 | 要能問 | 一行版（這版不做） |
| 2427-2431 | 　Detection of stale MVCC reads（偵測過時的 MVCC 讀取） |  |  | 不收（懂名詞／跳過） |
| 2432-2437 | 　Detection of writes that affect prior reads（偵測影響先前讀取的寫入） |  |  | 不收（懂名詞／跳過） |
| 2438-2445 | 　Performance of serializable snapshot isolation（SSI 的效能） | 跳過 | 要能問 | 一行版（這版不做） |
| 2446-2453 | Distributed Transactions（分散式交易） | 懂名詞 | 要能問 | 一行版（這版不做） |
| 2454-2458 | 　Two-Phase Commit（兩階段提交） | 懂名詞 | 要能問 | 一行版（這版不做） |
| 2459-2469 | 　A system of promises（承諾的系統） |  |  | 不收（懂名詞／跳過） |
| 2470-2476 | 　Coordinator failure（協調者故障） | 跳過 | 要能問 | 一行版（這版不做） |
| 2477-2481 | 　Three-phase commit（三階段提交） |  |  | 不收（懂名詞／跳過） |
| 2482-2488 | 　Distributed Transactions Across Different Systems（跨不同系統的分散式交易） | 懂名詞 | 要能問 | 一行版（這版不做） |
| 2489-2493 | 　Exactly-once message processing（恰好一次訊息處理） | 要能問 | 要能問 | 一行版（這版不做） |
| 2494-2499 | 　XA transactions（XA 交易） |  |  | 不收（懂名詞／跳過） |
| 2500-2504 | 　Holding locks while in doubt（存疑時持有鎖） | 跳過 | 要能問 | 一行版（這版不做） |
| 2505-2510 | 　Recovering from coordinator failure（從協調者故障中復原） | 跳過 | 要能問 | 一行版（這版不做） |
| 2511-2516 | 　Problems with XA transactions（XA 交易的問題） | 跳過 | 要能問 | 一行版（這版不做） |
| 2517-2527 | 　Database-Internal Distributed Transactions（資料庫內部分散式交易） | 跳過 | 要能問 | 一行版（這版不做） |
| 2528-2537 | 　Exactly-Once Message Processing Revisited（再談恰好一次訊息處理） | 要會用 | 要會用 | T4 主題頁 |
| 2538-2540 | Summary（本章小結） |  |  | 不收（懂名詞／跳過） |
| 2541-2599 | 名詞 |  |  | 不收（懂名詞／跳過） |
| 2600-2620 | 怎麼選（判準） | 要能問 | 要會用 | Q9 主題頁 |
| 2621-2643 | 容易誤解 | 要能問 | 要能問 | 一行版（這版不做） |

### 第 9 章 The Trouble with Distributed Systems（分散式系統的麻煩）

| 筆記行 | 段落 | 產品 | 平台 | 去處 |
|---|---|---|---|---|
| 2644-2650 | Faults and Partial Failures（故障與部分失效） | 要能問 | 要能問 | 一行版（這版不做） |
| 2651-2663 | Unreliable Networks（不可靠的網路） | 要會用 | 要會用 | T3 主題頁 |
| 2664-2671 | 　The Limitations of TCP（TCP 的限制） | 懂名詞 | 要能問 | 一行版（這版不做） |
| 2672-2684 | 　Network Faults in Practice（實務上的網路故障） | 要能問 | 要能問 | 一行版（這版不做） |
| 2685-2689 | 　Fault Detection（故障偵測） | 懂名詞 | 要能問 | 一行版（這版不做） |
| 2690-2697 | 　Timeouts and Unbounded Delays（逾時與無上限延遲） | 要能問 | 要會用 | Q10 主題頁 |
| 2698-2706 | 　Network congestion and queueing（網路壅塞與排隊） |  |  | 不收（懂名詞／跳過） |
| 2707-2712 | 　Variability of network delays（網路延遲的變動） | 跳過 | 要能問 | 一行版（這版不做） |
| 2713-2718 | 　Synchronous Versus Asynchronous Networks（同步與非同步網路） |  |  | 不收（懂名詞／跳過） |
| 2719-2723 | 　Latency and Resource Utilization（延遲與資源利用率） | 跳過 | 要能問 | 一行版（這版不做） |
| 2724-2728 | 　Combining circuit switching and packet switching（結合電路與封包交換） |  |  | 不收（懂名詞／跳過） |
| 2729-2735 | Unreliable Clocks（不可靠的時鐘） |  |  | 不收（懂名詞／跳過） |
| 2736-2751 | 　Monotonic Versus Time-of-Day Clocks（單調時鐘與日曆時鐘） | 懂名詞 | 要能問 | 一行版（這版不做） |
| 2752-2763 | 　Clock Synchronization and Accuracy（時鐘同步與準確度） | 要能問 | 要能問 | 一行版（這版不做） |
| 2764-2768 | 　Relying on Synchronized Clocks（依賴同步時鐘） | 懂名詞 | 要能問 | 一行版（這版不做） |
| 2769-2780 | 　Timestamps for ordering events（用時間戳排序事件） | 要能問 | 要會用 | Q10 主題頁 |
| 2781-2786 | 　Clock readings with a confidence interval（帶信賴區間的時鐘讀數） |  |  | 不收（懂名詞／跳過） |
| 2787-2794 | 　Synchronized clocks for global snapshots（以同步時鐘做全域快照） |  |  | 不收（懂名詞／跳過） |
| 2795-2824 | 　Process Pauses（行程暫停） | 跳過 | 要能問 | 一行版（這版不做） |
| 2825-2831 | 　Providing response time guarantees（提供回應時間保證） |  |  | 不收（懂名詞／跳過） |
| 2832-2840 | 　Limiting the impact of garbage collection（限制 GC 的影響） |  |  | 不收（懂名詞／跳過） |
| 2841-2844 | Knowledge, Truth, and Lies（知識、真相與謊言） |  |  | 不收（懂名詞／跳過） |
| 2845-2853 | 　The Majority Rules（多數決） | 懂名詞 | 要能問 | 一行版（這版不做） |
| 2854-2863 | 　Distributed Locks and Leases（分散式鎖與租約） | 要能問 | 要能問 | 一行版（這版不做） |
| 2864-2875 | 　Fencing off zombies and delayed requests（隔離殭屍與延遲請求） | 懂名詞 | 要會用 | Q10 主題頁 |
| 2876-2881 | 　Fencing with multiple replicas（多副本下的隔離） |  |  | 不收（懂名詞／跳過） |
| 2882-2895 | 　Byzantine Faults（拜占庭故障） |  |  | 不收（懂名詞／跳過） |
| 2896-2901 | 　Weak forms of lying（弱形式的說謊） |  |  | 不收（懂名詞／跳過） |
| 2902-2919 | 　System Model and Reality（系統模型與現實） | 跳過 | 要能問 | 一行版（這版不做） |
| 2920-2927 | 　Defining the correctness of an algorithm（定義演算法的正確性） |  |  | 不收（懂名詞／跳過） |
| 2928-2934 | 　Distinguishing between safety and liveness（區分安全性與活性） | 懂名詞 | 要能問 | 一行版（這版不做） |
| 2935-2940 | 　Mapping system models to the real world（把系統模型對應到現實） |  |  | 不收（懂名詞／跳過） |
| 2941-2945 | 　Formal Methods and Randomized Testing（形式化方法與隨機化測試） |  |  | 不收（懂名詞／跳過） |
| 2946-2951 | 　Model checking and specification languages（模型檢查與規格語言） |  |  | 不收（懂名詞／跳過） |
| 2952-2957 | 　Fault injection（故障注入） | 懂名詞 | 要能問 | 一行版（這版不做） |
| 2958-2966 | 　Deterministic simulation testing（確定性模擬測試） |  |  | 不收（懂名詞／跳過） |
| 2967-2973 | 　The Power of Determinism（確定性的力量） |  |  | 不收（懂名詞／跳過） |
| 2974-2979 | Summary（總結） | 要能問 | 要會用 | Q10 主題頁 |
| 2980-3010 | 名詞 |  |  | 不收（懂名詞／跳過） |
| 3011-3018 | 怎麼選（判準） | 要能問 | 要會用 | Q10 主題頁 |
| 3019-3037 | 容易誤解 | 要能問 | 要能問 | 一行版（這版不做） |

### 第 10 章 Consistency and Consensus（一致性與共識）

| 筆記行 | 段落 | 產品 | 平台 | 去處 |
|---|---|---|---|---|
| 3038-3043 | 章首：兩種處理複本不一致的哲學 | 要能問 | 要會用 | Q11 主題頁 |
| 3044-3048 | Linearizability（線性一致性） | 要能問 | 要能問 | 一行版（這版不做） |
| 3049-3064 | 　What Makes a System Linearizable?（什麼讓系統成為線性一致） |  |  | 不收（懂名詞／跳過） |
| 3065-3077 | 　Linearizability Versus Serializability（線性一致性 vs 可序列化） | 懂名詞 | 要能問 | 一行版（這版不做） |
| 3078-3091 | 　Relying on Linearizability（何時需要線性一致性） | 要會用 | 要會用 | T7 主題頁 |
| 3092-3108 | 　Implementing Linearizable Systems（如何實作線性一致系統） | 懂名詞 | 要能問 | 一行版（這版不做） |
| 3109-3127 | 　The Cost of Linearizability（線性一致性的代價） | 要能問 | 要會用 | Q11 主題頁 |
| 3128-3144 | ID Generators and Logical Clocks（ID 產生器與邏輯時鐘） | 要能問 | 要能問 | 一行版（這版不做） |
| 3145-3166 | 　Logical Clocks（邏輯時鐘） |  |  | 不收（懂名詞／跳過） |
| 3167-3179 | 　Linearizable ID Generators（線性一致的 ID 產生器） | 要能問 | 要能問 | 一行版（這版不做） |
| 3180-3185 | Consensus（共識） | 懂名詞 | 要能問 | 一行版（這版不做） |
| 3186-3192 | 　The Impossibility of Consensus（共識的不可能性） |  |  | 不收（懂名詞／跳過） |
| 3193-3200 | 　The Many Faces of Consensus（共識的多種面貌） | 跳過 | 要能問 | 一行版（這版不做） |
| 3201-3218 | 　　單值共識（Single-value consensus） |  |  | 不收（懂名詞／跳過） |
| 3219-3223 | 　　CAS 即共識（Compare-and-set as consensus）（p.453） |  |  | 不收（懂名詞／跳過） |
| 3224-3240 | 　　共享日誌即共識（Shared logs as consensus） |  |  | 不收（懂名詞／跳過） |
| 3241-3245 | 　　Fetch-and-add 即共識（Fetch-and-add as consensus） |  |  | 不收（懂名詞／跳過） |
| 3246-3252 | 　　原子提交即共識（Atomic commitment as consensus） |  |  | 不收（懂名詞／跳過） |
| 3253-3283 | 　Consensus in Practice（實務中的共識） | 懂名詞 | 要能問 | 一行版（這版不做） |
| 3284-3304 | 　Coordination Services（協調服務） | 懂名詞 | 要會用 | Q11 主題頁 |
| 3305-3308 | Summary（本章總結） | 懂名詞 | 要能問 | 一行版（這版不做） |
| 3309-3338 | 名詞 |  |  | 不收（懂名詞／跳過） |
| 3339-3343 | 怎麼選（判準） | 要能問 | 要會用 | Q11 主題頁 |
| 3344-3359 | 容易誤解 | 懂名詞 | 要能問 | 一行版（這版不做） |

### 第 11 章 Batch Processing（批次處理）

| 筆記行 | 段落 | 產品 | 平台 | 去處 |
|---|---|---|---|---|
| 3360-3377 | 章首：線上系統與批次處理 | 要能問 | 要會用 | Q14 主題頁 |
| 3378-3381 | Batch Processing with Unix Tools（用 Unix 工具做批次處理） |  |  | 不收（懂名詞／跳過） |
| 3382-3402 | 　Simple Log Analysis（簡單的日誌分析） |  |  | 不收（懂名詞／跳過） |
| 3403-3406 | 　Chain of Commands Versus Custom Program（命令鏈 vs 自訂程式） |  |  | 不收（懂名詞／跳過） |
| 3407-3413 | 　Sorting Versus In-Memory Aggregation（排序 vs 記憶體內聚合） | 跳過 | 要能問 | 一行版（這版不做） |
| 3414-3416 | Batch Processing in Distributed Systems（分散式系統中的批次處理） |  |  | 不收（懂名詞／跳過） |
| 3417-3434 | 　Distributed Filesystems（分散式檔案系統） |  |  | 不收（懂名詞／跳過） |
| 3435-3445 | 　Object Stores（物件儲存） | 跳過 | 要能問 | 一行版（這版不做） |
| 3446-3454 | 　Distributed Job Orchestration（分散式作業編排） |  |  | 不收（懂名詞／跳過） |
| 3455-3466 | 　Resource allocation（資源分配） | 跳過 | 要能問 | 一行版（這版不做） |
| 3467-3477 | 　Scheduling workflows（排程工作流） | 懂名詞 | 要能問 | 一行版（這版不做） |
| 3478-3487 | 　Handling faults（處理故障） | 跳過 | 要能問 | 一行版（這版不做） |
| 3488-3491 | Batch Processing Models（批次處理模型） |  |  | 不收（懂名詞／跳過） |
| 3492-3504 | 　MapReduce |  |  | 不收（懂名詞／跳過） |
| 3505-3517 | 　Dataflow Engines（資料流引擎） |  |  | 不收（懂名詞／跳過） |
| 3518-3530 | 　Shuffling Data（資料洗牌） |  |  | 不收（懂名詞／跳過） |
| 3531-3541 | 　Joins and Grouping（Join 與分組） |  |  | 不收（懂名詞／跳過） |
| 3542-3554 | 　Query Languages（查詢語言） | 懂名詞 | 要能問 | 一行版（這版不做） |
| 3555-3560 | 　DataFrames |  |  | 不收（懂名詞／跳過） |
| 3561-3563 | Batch Use Cases（批次處理的使用情境） |  |  | 不收（懂名詞／跳過） |
| 3564-3571 | 　Extract–Transform–Load（ETL） | 懂名詞 | 要會用 | Q14 主題頁 |
| 3572-3578 | 　Analytics（分析） | 懂名詞 | 要能問 | 一行版（這版不做） |
| 3579-3589 | 　Machine Learning（機器學習） |  |  | 不收（懂名詞／跳過） |
| 3590-3604 | 　Serving Derived Data（提供衍生資料） | 要能問 | 要會用 | Q14 主題頁 |
| 3605-3607 | Summary（本章總結） |  |  | 不收（懂名詞／跳過） |
| 3608-3638 | 名詞 |  |  | 不收（懂名詞／跳過） |
| 3639-3645 | 怎麼選（判準） | 要能問 | 要會用 | Q14 主題頁 |
| 3646-3659 | 容易誤解 | 要能問 | 要能問 | 一行版（這版不做） |

### 第 12 章 Stream Processing（串流處理）

| 筆記行 | 段落 | 產品 | 平台 | 去處 |
|---|---|---|---|---|
| 3660-3663 | 開場：從有界到無界 |  |  | 不收（懂名詞／跳過） |
| 3664-3668 | Transmitting Event Streams（傳遞事件串流） |  |  | 不收（懂名詞／跳過） |
| 3669-3714 | 　Messaging Systems（訊息系統） | 要能問 | 要會用 | Q12 主題頁 |
| 3715-3763 | 　Log-Based Message Brokers（日誌式訊息代理） | 要能問 | 要會用 | Q12 主題頁 |
| 3764-3768 | Databases and Streams（資料庫與串流） |  |  | 不收（懂名詞／跳過） |
| 3769-3775 | 　Keeping Systems in Sync（讓系統保持同步） | 要能問 | 要會用 | Q13 主題頁 |
| 3776-3816 | 　Change Data Capture（變更資料擷取） | 要能問 | 要會用 | Q13 主題頁 |
| 3817-3846 | 　State, Streams, and Immutability（狀態、串流與不可變性） | 要能問 | 要會用 | Q13 主題頁 |
| 3847-3854 | Processing Streams（處理串流） |  |  | 不收（懂名詞／跳過） |
| 3855-3888 | 　Uses of Stream Processing（串流處理的用途） | 懂名詞 | 要能問 | 一行版（這版不做） |
| 3889-3925 | 　Reasoning About Time（關於時間的推理） | 要能問 | 要會用 | Q15 主題頁 |
| 3926-3974 | 　Stream Joins（串流 join） | 要能問 | 要會用 | Q15 主題頁 |
| 3975-4004 | 　Fault Tolerance（容錯） | 要能問 | 要會用 | Q15 主題頁 |
| 4005-4010 | Summary（本章總結） |  |  | 不收（懂名詞／跳過） |
| 4011-4043 | 名詞 |  |  | 不收（懂名詞／跳過） |
| 4044-4051 | 怎麼選（判準） | 要能問 | 要會用 | Q15 主題頁 |
| 4052-4071 | 容易誤解 | 要能問 | 要能問 | 一行版（這版不做） |

### 第 13 章 A Philosophy of Streaming Systems（串流系統的設計哲學）

| 筆記行 | 段落 | 產品 | 平台 | 去處 |
|---|---|---|---|---|
| 4072-4076 | Data Integration（資料整合） |  |  | 不收（懂名詞／跳過） |
| 4077-4107 | 　Combining Specialized Tools by Deriving Data（以衍生資料組合專門工具） | 要能問 | 要會用 | Q13 主題頁 |
| 4108-4127 | 　Batch and Stream Processing（批次與串流處理） | 要會用 | 要會用 | T10 主題頁 |
| 4128-4140 | Unbundling Databases（拆解資料庫） |  |  | 不收（懂名詞／跳過） |
| 4141-4167 | 　Composing Data Storage Technologies（組合資料儲存技術） | 懂名詞 | 要會用 | Q13 主題頁 |
| 4168-4199 | 　Designing Applications Around Dataflow（圍繞資料流設計應用） | 要能問 | 要能問 | 一行版（這版不做） |
| 4200-4239 | 　Observing Derived State（觀察衍生狀態） | 要能問 | 要能問 | 一行版（這版不做） |
| 4240-4245 | Aiming for Correctness（追求正確性） |  |  | 不收（懂名詞／跳過） |
| 4246-4277 | 　The End-to-End Argument for Databases（資料庫的端到端論證） | 要會用 | 要會用 | T4 主題頁 |
| 4278-4307 | 　Enforcing Constraints（強制約束） | 要會用 | 要會用 | T7 主題頁 |
| 4308-4350 | 　Timeliness and Integrity（及時性與完整性） | 要會用 | 要會用 | T8 主題頁 |
| 4351-4380 | 　Trust, but Verify（信任，但要驗證） | 要能問 | 要會用 | Q16 主題頁 |
| 4381-4384 | Summary（本章摘要） |  |  | 不收（懂名詞／跳過） |
| 4385-4408 | 名詞 |  |  | 不收（懂名詞／跳過） |
| 4409-4416 | 怎麼選（判準） | 要會用 | 要會用 | T8 主題頁 |
| 4417-4434 | 容易誤解 | 要能問 | 要能問 | 一行版（這版不做） |

### 第 14 章 Doing the Right Thing（做對的事）

| 筆記行 | 段落 | 產品 | 平台 | 去處 |
|---|---|---|---|---|
| 4435-4441 | 開場：工程師的倫理責任 |  |  | 不收（懂名詞／跳過） |
| 4442-4446 | Predictive Analytics（預測分析） |  |  | 不收（懂名詞／跳過） |
| 4447-4454 | 　Bias and Discrimination（偏見與歧視） | 懂名詞 | 要能問 | 一行版（這版不做） |
| 4455-4461 | 　Responsibility and Accountability（責任與問責） | 要能問 | 懂名詞 | 一行版（這版不做） |
| 4462-4468 | 　Feedback Loops（回饋迴圈） |  |  | 不收（懂名詞／跳過） |
| 4469-4475 | Privacy and Tracking（隱私與追蹤） | 要能問 | 懂名詞 | 一行版（這版不做） |
| 4476-4484 | 　Surveillance（監控） |  |  | 不收（懂名詞／跳過） |
| 4485-4493 | 　Consent and Freedom of Choice（同意與選擇自由） | 要能問 | 懂名詞 | 一行版（這版不做） |
| 4494-4503 | 　Privacy and Use of Data（隱私與資料使用） |  |  | 不收（懂名詞／跳過） |
| 4504-4511 | 　Data as Assets and Power（資料即資產與權力） | 懂名詞 | 要能問 | 一行版（這版不做） |
| 4512-4516 | 　Remembering the Industrial Revolution（記取工業革命） |  |  | 不收（懂名詞／跳過） |
| 4517-4525 | 　Legislation and Self-Regulation（立法與自律） | 要能問 | 要會用 | T12 主題頁 |
| 4526-4530 | Summary（本章與全書摘要） |  |  | 不收（懂名詞／跳過） |
| 4531-4550 | 名詞 |  |  | 不收（懂名詞／跳過） |
| 4551-4556 | 怎麼選（判準） | 要能問 | 要能問 | 一行版（這版不做） |
| 4557-4633 | 容易誤解 |  |  | 不收（懂名詞／跳過） |
