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
