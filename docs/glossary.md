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
