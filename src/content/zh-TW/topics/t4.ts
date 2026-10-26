import type { TopicText } from '../../types'

export const t4 = {
  title: '安全重試：請求 ID 與去重',
  summary: '要讓重送不會重複，伺服器得認出「這是同一個請求」：每次送出帶一個唯一的請求 ID，資料庫只執行一次。',
  tags: ['交易', '去重', '請求 ID', '唯一約束', '端到端論證'],
  sections: {
    'ch8-handling-errors-and-aborts': {
      conclusion:
        '交易（transaction）被中止（abort）後重試（retry）是對的，資料庫回滾，正是為了讓重試安全。但如果交易其實成功，只是提交確認遺失，重試會讓它執行兩次，所以需要去重（deduplication）。而且只有暫時性錯誤（transient error）值得重試。',
      tradeoff:
        '自動重試能救回暫時性錯誤，但可能重複執行，或在系統過載時讓情況更糟；需要去重、次數上限與指數退避（exponential backoff）。',
      questions: [
        '如果交易其實成功、只是回應遺失，使用者再按一次會發生什麼？',
        '我們用什麼去重？',
        '哪些錯誤會自動重試？過載時有次數上限和退避嗎？',
      ],
      examples: [
        {
          source: 'book',
          text: '書中的例子：交易成功了，但伺服器回傳提交確認時網路斷了；用戶端看到逾時（timeout）而重試，同一筆交易就執行了兩次。',
        },
        {
          source: 'ours',
          text: '訂單已經成立，確認回應卻在路上遺失；使用者看到逾時，再按一次「送出訂單」，就多了一張訂單。反過來，訂購數量超過上限這類違反約束的永久性錯誤，重送幾次結果都一樣，不該重送。',
        },
      ],
    },
    'ch8-exactly-once-message-processing-revisited': {
      conclusion:
        '不需要分散式交易（distributed transaction），也能做到恰好一次（exactly-once）：在處理訊息的同一筆資料庫交易（transaction）裡，記下這則訊息的 ID，並加上唯一約束（uniqueness constraint），重送就只會生效一次。',
      tradeoff: '多一張記錄 ID 的表，每次多一次查詢與寫入，換來可以安全重試（retry）。',
      questions: ['每個請求或訊息都有唯一 ID 嗎？', '重送時，後端會用這個 ID 認出重複嗎？', '這個 ID 和訂單是在同一筆交易裡寫入的嗎？'],
      examples: [
        {
          source: 'book',
          text: '書中的例子：處理器提交交易之後、向訊息代理（message broker）確認之前當機，代理會重送這則訊息；處理器看到 ID 已經在表裡，就丟掉它。兩個並行交易想插入同一個 ID 時，唯一約束只讓一個成功。',
        },
        {
          source: 'ours',
          text: '送出訂單時帶著購物車 session ID（cart session ID），它就是這張訂單的請求 ID（request ID）。伺服器在建立訂單的同一筆交易裡，把這個購物車 session 標成已下單；訂單上的購物車 session ID 有唯一約束，重送時被擋下，伺服器回傳原本那張訂單，而不是錯誤。',
        },
      ],
    },
    'ch13-the-end-to-end-argument-for-databases': {
      conclusion:
        '連線層的去重（deduplication）擋不住使用者在逾時（timeout）後重送：對網頁伺服器那是另一個請求，對資料庫是另一筆交易（transaction）。要有一個在第一次送出前就存在的唯一請求 ID（request ID），每次重送都帶著它，一路傳到資料庫，同一個 ID 只執行一次。這是端到端論證（end-to-end argument）的一個例子。',
      tradeoff:
        '端到端的請求 ID 需要前端、後端與資料表一起配合：ID 在送出前建立、重送時沿用，資料表加上唯一約束（uniqueness constraint）。不做，就可能重複收費或重複建立。',
      questions: [
        '使用者在逾時後重按「送出訂單」，後端靠什麼認出這是同一次購買？',
        '重新整理頁面或換一個分頁再送，帶的還是同一個 ID 嗎？',
        '這個 ID 是一次購買一個，還是整個登入 session 共用？',
      ],
      examples: [
        {
          source: 'book',
          text: '書中的例子：一筆轉帳交易從一個帳戶扣 $11、另一個帳戶加 $11；客戶端斷線重連後重試（retry），可能轉了 $22。修法是在 requests 表的 request_id 欄位加唯一約束，交易先插入請求 ID，重送時插入失敗，整筆交易中止（abort）。',
        },
        {
          source: 'book',
          text: '書中也提到：瀏覽器多半用 HTTP POST 送出這類指令。送出後轉址的做法（Post/Redirect/Get）能讓使用者重新整理頁面時，不再跳出「要重新送出表單嗎」的警告；但 POST 逾時時，這個做法幫不上忙：對網頁伺服器來說，使用者重送是另一個請求，對資料庫來說是另一筆交易。',
        },
        {
          source: 'ours',
          text: '使用者放進第一件商品時，後端就建立一個購物車 session，給它一個 ID（購物車 session ID，cart session ID）；這就是這張訂單的請求 ID。重送、重新整理都帶同一個，因為它存在後端，不在連線上。訂單上的購物車 session ID 有唯一約束，同一個購物車 session 最多變成一張訂單；下單後後端再開一個新的。TCP 只在同一條連線裡去重，擋不住使用者重按；擋得住的是這個存在後端的 ID。',
        },
      ],
      diagram: {
        lanes: ['browser', 'server', 'database'],
        caption:
          '後端不會再建立一次訂單：它看到購物車 session c1 已經下過單，就回傳原本那張。c1 在送出前就存在後端，所以重送、換連線、重新整理都帶同一個；TCP 和網頁伺服器只看得到「又一個新請求」。沒有這個 ID，第二筆交易也會提交，多出訂單\u00a0#2；書中的轉帳就是這樣多轉了一次 $11。',
        steps: [
          { at: 'database', text: '結帳前：購物車 session c1 已建立，狀態「進行中」' },
          { from: 'browser', to: 'server', text: '送出訂單，帶購物車 session ID c1（連線\u00a01）' },
          { from: 'server', to: 'database', text: '同一筆交易：建立訂單\u00a0#1，c1 標成已下單，提交' },
          { from: 'server', to: 'browser', fate: 'lost', text: '「訂單已成立」的回應，在連線\u00a01 斷線時遺失' },
          { at: 'browser', text: '逾時。使用者再按一次「送出訂單」' },
          { from: 'browser', to: 'server', text: '再送一次，仍帶 c1。這是新的連線\u00a02，TCP 看不出是重送' },
          { from: 'server', to: 'database', fate: 'rejected', text: '同一筆交易：c1 已經下過單（唯一約束），交易中止，不建立訂單\u00a0#2' },
          { from: 'server', to: 'browser', text: '查出 c1 的訂單\u00a0#1，回傳「訂單已成立」' },
        ],
      },
    },
  },
} as const satisfies TopicText<'T4'>
