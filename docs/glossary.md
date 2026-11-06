# 術語表（寫內容的人用，不在網站上顯示）

中文版在每個段落區塊或每一題裡第一次出現時寫「中文（English）」，之後只寫中文。英文照書中用字。新增主題時把新術語加進來。

| 中文 | English（書中用字） | 說明 |
|---|---|---|
| 逾時 | timeout | 等一段時間沒收到回應就放棄；只代表「還沒收到回應」 |
| 不可靠的網路 | unreliable networks | 請求或回應可能遺失、延遲，送出的一方分不出是哪一種 |
| 重試 | retry | 失敗或逾時後再送一次 |
| 冪等 | idempotent / idempotence | 做幾次結果都和做一次一樣 |
| 請求 ID | request ID | 第一次送出前就存在的唯一識別碼，重送時沿用，一路傳到資料庫（書中的例子放在客戶端的隱藏表單欄位） |
| 購物車 session ID | cart session ID（本站用詞，書中沒有） | 一次購買一個；後端在結帳前建立、下單後結束，在「送出訂單」情境裡就是請求 ID。不是登入 session |
| 去重 | deduplication；duplicate suppression | 認出重複的請求或訊息，只執行一次 |
| 唯一約束 | uniqueness constraint | 資料庫保證某欄位的值不重複 |
| 交易 | transaction | 一組讀寫，要嘛全部提交、要嘛全部中止 |
| 分散式交易 | distributed transaction | 跨多個節點或系統、一起提交或一起中止的交易 |
| 中止 | abort | 交易放棄並回滾，不留下做到一半的結果 |
| 暫時性錯誤 | transient error | 過一下可能就好的錯誤（死結、暫時斷線、故障切換），值得重試 |
| 指數退避 | exponential backoff | 每次重試前等更久，避免讓過載更嚴重 |
| 恰好一次 | exactly-once | 即使重送，最終效果也和只執行一次相同 |
| 端到端論證 | end-to-end argument | 正確性只能由兩端的應用保證，中間的層只能幫忙 |
| 送出後轉址的做法 | Post/Redirect/Get | 表單用 POST 送出後，伺服器轉址到一個 GET 頁面，重新整理就不會再送一次表單；擋不住逾時後的重送 |
| 遠端程序呼叫 | remote procedure call (RPC) | 讓網路請求看起來像本地函式呼叫的做法 |
| 訊息代理 | message broker | 在服務之間暫存、轉送訊息的系統 |
| 驗收條件 | acceptance criterion（本站用詞，書中沒有） | 一條可以檢查是否做到的需求，例如逾時時畫面該說什麼 |
| 功能性需求 | functional requirements | 應用要有哪些畫面與按鈕、每個操作做什麼 |
| 非功能性需求 | nonfunctional requirements | 描述可靠性、效能等系統品質的需求 |
| 可靠性 | reliability | 故障或錯誤下仍能提供正確服務的能力 |
| 漸進推出 | staged rollout | 先給一小部分使用者或節點套用變更，再逐步擴大 |
| 資料遺失 | data loss | 已有的資料因故障或錯誤而不見 |
| 中位數 | median | 把觀測值分為快慢兩半的值 |
| 百分位數 | percentile | 描述觀測值分布位置的指標，例如 p99 |
| 尾端延遲 | tail latency | 最慢一群請求的等待時間 |
| 尾端延遲放大 | tail latency amplification | 一個請求要等的後端呼叫越多，越可能被其中最慢的拖慢 |
| 服務水準目標 | service level objective | 可量測的服務品質目標 |
| 及時性 | timeliness | 變更何時可見或結果何時到達 |
| 完整性 | integrity | 資料和結果保持正確且符合約束 |
| 同步協調 | synchronous coordination | 操作完成前先取得參與者一致決定 |
| 補償 | compensation | 事後修正已發生但不理想的結果 |
| 資料最小化 | data minimization | 只收集完成明確目的所需的資料 |
| 保留期限 | retention period | 允許資料保存的時間 |
| 刪除 | deletion | 在既定生命週期中移除資料及副本 |
| 僅附加日誌 | append-only log | 只能在尾端新增、不改舊紀錄的日誌，很難刪掉中間的資料 |
| 個人資料 | personal data | 可直接或間接識別個人的資料 |
| 領導者 | leader | 接受寫入、再複製給其他副本的節點 |
| 追隨者 | follower | 從領導者接收變更的副本 |
| 非同步複製 | asynchronous replication | 領導者不等追隨者確認就回報寫入成功 |
| 多主複製 | multi-leader replication | 多個節點都能接受寫入，事後再互相同步 |
| 複製延遲 | replication lag | 領導者寫入後，追隨者尚未更新的時間差 |
| 最終一致性 | eventual consistency | 在沒有新寫入時，副本最後能收斂到相同值 |
| 寫後讀一致性 | read-your-writes consistency | 使用者能讀到自己的最新寫入 |
| 過期讀取 | stale read | 讀到比最新提交更舊的版本 |
| 讀取-修改-寫入循環 | read-modify-write cycle | 讀出值、在應用裡修改、再寫回 |
| 遺失更新 | lost update | 一筆更新被另一筆並行更新覆蓋 |
| 並行寫入 | concurrent writes | 多個寫入在時間上重疊 |
| 衝突解決 | conflict resolution | 決定並行修改如何合併或選擇 |
| 最後寫入者勝 | last write wins | 依時間戳或順序只保留一個寫入 |
| 一致性 | consistency | 交易前後仍滿足應用定義的不變條件 |
| 不變條件 | invariant | 資料必須永遠成立的規則，例如借貸平衡 |
| 隔離 | isolation | 並行的交易彼此不互相干擾的程度 |
| 可用性 | availability | 系統能回應請求的程度 |
| 寫偏斜 | write skew | 多筆交易各寫不同資料，合起來違反共同規則 |
| 線性一致性 | linearizability | 操作看起來在單一時間點依序生效 |
| 向後相容 | backward compatibility | 新程式仍能理解舊資料 |
| 向前相容 | forward compatibility | 舊程式仍能理解新資料 |
| 滾動升級 | rolling upgrade | 逐台部署，期間新舊程式共存 |
| 未知欄位 | unknown fields | 新格式新增而舊程式尚不認識的欄位 |
| 回滾 | rollback | 退回上一個版本或撤銷尚未完成的變更 |
| 可演進性 | evolvability | 系統能安全且容易地隨需求修改 |
| 不可逆 | irreversibility | 做了就回不去的變更，讓改變的風險升高 |
| 批次處理 | batch processing | 一次處理一大批累積的資料 |
| 結構遷移 | schema migration | 逐步變更資料結構及其讀寫程式 |
| 新舊資料 | old and new data | 不同版本程式在不同時期寫下的紀錄 |
| 重建 | rebuild | 從原始來源重新算出衍生資料 |
| 記錄系統 | system of record | 權威的原始事實來源 |
| 衍生資料 | derived data | 從原始資料計算出的快取、索引或視圖 |
| 資料倉儲 | data warehouse | 集中存放供分析用的資料，通常是衍生資料 |
| 正規化 | normalization | 將共同事實放在一處並以 ID 引用 |
| 反正規化 | denormalization | 為讀取方便複製資料 |
| 多租戶 | multitenancy | 多個獨立租戶共用一套系統 |
| 分片 | sharding；shard | 將資料分散到不同資料分區；名詞指其中一份 |
| 租戶隔離 | tenant isolation | 以租戶為界限制資料與操作的影響 |
| 存取控制 | access control | 決定誰能讀寫哪些資料 |
| 跨租戶查詢 | cross-tenant query | 讀取多個租戶資料的查詢 |
| 營運系統 | operational system | 資料產生的地方；應用依使用者的動作讀寫自己的資料庫 |
| 分析系統 | analytical system | 存營運資料的唯讀副本，為分析師與資料科學家的查詢最佳化 |
| 資料孤島 | data silos | 資料散在多個系統，難以在一個查詢裡合併 |
| 雲端服務 | cloud services | 把軟體的營運外包給雲端供應商 |
| 自行託管 | self-hosting | 自己部署並營運系統，不交給雲端供應商 |
| 廠商鎖定 | vendor lock-in | 服務沒有相容的替代品，換掉的成本很高 |
| 微服務 | microservices | 每個服務一個目的、一個負責團隊、自己的資料庫，可獨立部署 |
| 無伺服器 | serverless | 由雲端供應商依請求配置機器，只為程式實際執行的時間付費 |
| 可擴展性 | scalability | 系統應付負載增加的能力 |
| 吞吐量 | throughput | 單位時間處理的量，例如每秒請求數 |
| 重試風暴 | retry storm | 系統變慢時用戶端逾時重送，讓負載更重 |
| 物化視圖 | materialized view | 預先算好並持續更新的查詢結果 |
| 容錯 | fault tolerance | 某些故障發生時，系統仍持續提供服務 |
| 單點故障 | single point of failure | 一壞就讓整個系統停擺的部分 |
| 故障注入 | fault injection | 刻意製造故障，讓容錯機制持續被演練 |
| 可營運性 | operability | 讓營運團隊容易維持系統正常運作 |
| 可觀測性 | observability | 從外部看見系統執行時行為的能力 |
| 讀時 schema | schema-on-read | 資料庫不強制結構，讀取時才解讀 |
| 寫時 schema | schema-on-write | 寫入時由資料庫確保資料符合明確的 schema |
| 事件溯源 | event sourcing | 每個狀態改變都記成事件，附加在事件日誌上，以日誌為事實來源 |
| 命令查詢職責分離 | command query responsibility segregation；CQRS | 寫入用一種表示，讀取用從它衍生、為讀取最佳化的其他表示 |
| 資料立方體 | data cube | 依多個維度預先算好的彙總格網，固定查詢極快但不夠彈性 |
| 索引 | index | 從主要資料衍生的結構，加快特定查詢，但佔空間、拖慢寫入 |
| 備份 | backup | 資料在某個時間點的舊快照，能在誤刪或損壞後回到過去 |
| 故障轉移 | failover | 領導者故障時，把一個追隨者升為新領導者 |
| 持久性 | durability | 已確認的寫入不會因故障而遺失；沒有一種做法是完美的 |
| 分區鍵 | partition key | 決定紀錄放在哪個分片（或日誌的哪個分區）的鍵，事後很難更改 |
| 再平衡 | rebalancing | 把分片搬到其他節點，讓負載重新分配 |
| 連鎖故障 | cascading failure | 一處過載或誤判讓負載轉到其他節點，接連拖垮更多節點 |
| 隔離等級 | isolation level | 資料庫對並行交易保證到什麼程度；名稱各家不一，要看實際行為 |
| 快照隔離 | snapshot isolation | 每個交易只讀它開始時已提交的一致快照 |
| 可序列化 | serializable / serializability | 並行交易的結果和某種依序執行的結果相同 |
| 租約 | lease | 有期限的鎖；到期沒續約就失效，由別的節點取得 |
| 隔離權杖 | fencing token | 每次授予鎖或租約時遞增的數字；儲存端拒絕較舊的數字，擋住殭屍與延遲的請求 |
| 強一致性 | strong consistency | 系統表現得像只有一份資料；精確的定義是線性一致性 |
| 網路分區 | network partition | 網路中斷，讓節點分成彼此連不上的幾群 |
| 協調服務 | coordination service | 以共識提供鎖、選出領導者等功能的服務，只存少量、變化慢的資料（例如 ZooKeeper、etcd） |
| 持久執行 | durable execution | 記下工作流程每一步的結果，失敗重跑時跳過已成功的步驟 |
| 死信佇列 | dead letter queue | 存放一再處理失敗的訊息，讓後面的訊息繼續前進 |
| 雙寫 | dual writes | 應用程式自己依序寫資料庫、搜尋索引、快取等多個系統；並行或部分失敗時會靜默地不一致 |
| 競爭條件 | race condition | 結果取決於並行操作碰巧的先後順序 |
| 變更資料擷取 | change data capture / CDC | 擷取資料庫的每筆變更，依寫入順序送給下游系統套用 |
| 外寄匣模式 | outbox pattern | 在同一筆交易裡另寫一張對外的表，只把它開放給變更資料擷取，內部資料表就能自由修改 |
| 資料合約 | data contract | 上下游團隊對發布資料的格式與意義的約定，避免上游改動弄壞下游 |
| 不可變性 | immutability | 資料寫入後不再修改，只新增新的紀錄 |
| 拆解式資料庫 | unbundled database | 用變更資料擷取與事件日誌把多套專門的儲存系統接成一個整體 |
| 線上系統 | online systems | 收到請求就要盡快回應的系統，例如網站後端、資料庫、快取 |
| 串流處理 | stream processing | 持續處理新進的事件，在資料變更後不久就產生結果 |
| 批量載入 | bulk-load | 批次作業先建好整份資料庫檔，再一次匯入線上資料庫 |
| 時間旅行 | time travel | 保留舊版本的輸出或資料，出錯時直接切回去 |
| 事件時間 | event time | 事件實際發生的時間，記在事件本身 |
| 處理時間 | processing time | 處理器處理該事件時，自己時鐘上的時間 |
| 落後事件 | straggler events | 所屬時間視窗已經宣布結束後才到達的事件 |
| 日誌壓縮 | log compaction | 每個鍵只保留最新一筆紀錄，讓日誌大小只取決於目前內容 |
| 偏移量 | offset | 訊息在日誌分區中單調遞增的位置編號 |
| 資料損壞 | data corruption | 資料因硬體、軟體 bug 或操作錯誤而變得不正確 |
| 稽核 | auditing | 檢查資料完整性，發現損壞並追查來源 |
| 擷取、轉換、載入 | ETL (extract–transform–load) | 從營運資料庫取出資料、轉成分析用的格式、載入資料倉儲 |
| 混合式交易／分析處理 | HTAP | 同一套系統同時做交易處理與分析 |
| 服務水準協議 | SLA (service-level agreement) | 對外承諾的效能或可用性水準 |
| 線性擴展 | linear scalability | 資源加倍，能處理的負載也加倍 |
| 自動擴縮 | autoscaling | 依負載自動增減機器 |
| 水平擴展 | horizontal scaling (scaling out) | 加機器而不是換更大的機器 |
| 亞穩態失效 | metastable failure | 負載降回來後系統仍卡在過載狀態，例如重試風暴 |
| 負載卸除 | load shedding | 過載時主動拒絕部分請求 |
| 背壓 | backpressure | 下游跟不上時，讓上游放慢或暫停送出 |
| 物化 | materialization | 預先算好結果並持續更新 |
| 扇出 | fan-out | 一個請求或事件要寫到或送到許多地方 |
| 預備環境 | staging | 上線前用來驗證的、接近正式環境的環境 |
| 事件 | event | 已經發生的事實，不可變 |
| 命令 | command | 使用者的請求，驗證通過後才變成事件 |
| 事件日誌 | event log | 只能附加的事件序列 |
| 不可變 | immutable | 寫入後不再修改 |
| 確定性 | deterministic | 同樣的輸入一定得到同樣的結果 |
| 副作用 | side effect | 處理之外對外界造成的影響，例如寄信 |
| 維度 | dimension | 分析時用來切分資料的欄位，例如日期、地區 |
| 彙總 | aggregate | 由多筆資料算出的總數、平均等 |
| 複製 | replication | 在多個節點保存同一份資料 |
| 同步複製 | synchronous replication | 領導者等追隨者確認才回報寫入成功 |
| 半同步 | semisynchronous | 只等一個追隨者同步確認，其餘非同步 |
| 單主複製 | single-leader replication | 只有一個節點接受寫入，其他節點跟著複製 |
| 無主複製 | leaderless replication | 沒有領導者，用戶端直接寫到多個節點 |
| 腦裂 | split brain | 兩個節點都以為自己是領導者 |
| 讀已提交 | read committed | 只讀到已提交的資料、只覆寫已提交的資料的隔離等級 |
| 讀偏斜 | read skew | 一次讀取看到不同時間點的資料，前後對不起來 |
| 原子操作 | atomic operation | 資料庫一步完成的讀取－修改－寫入，例如遞增 |
| 網路延遲沒有上限 | unbounded delays | 網路不保證訊息多久會到 |
| 日曆時鐘 | time-of-day clock | 回報目前日期時間的時鐘，可能被校正而跳動 |
| 時間戳 | timestamp | 記在資料上的時間 |
| 邏輯時鐘 | logical clock | 用計數而非實際時間來排定事件順序 |
| 版本向量 | version vector | 記錄每個副本各自版本號的向量，用來判斷寫入是否並行 |
| 殭屍 | zombie | 以為自己還持有租約或領導權、其實已被取代的節點 |
| 條件寫入 | conditional write | 只在資料符合條件（例如版本沒變）時才寫入 |
| 共識 | consensus | 多個節點對同一個值達成一致 |
| 工作流程 | workflow | 跨服務的多步驟工作 |
| 生產者 | producer | 送出訊息的一方 |
| 消費者 | consumer | 接收並處理訊息的一方 |
| 佇列 | queue | 每則訊息只交給一個消費者 |
| 主題 | topic | 訊息發布的具名頻道；日誌式訊息代理裡由多個分區組成 |
| 確認 | acknowledgment | 消費者告訴代理一則訊息已處理完 |
| 日誌式訊息代理 | log-based message broker | 把訊息存成只能附加的日誌，消費者記住讀到的位置 |
| 分區 | partition | 日誌或資料集切開的一塊；順序只在同一個分區內保證 |
