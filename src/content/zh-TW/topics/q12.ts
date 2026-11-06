import type { TopicText } from '../../types'

export const q12 = {
  title: '資料怎麼在服務之間流動',
  summary: '資料可以經由共用的資料庫、多步驟的工作流程或訊息傳遞；每一種都要先回答：新舊版本能否互讀、做到一半失敗怎麼辦、訊息會不會掉或重複。',
  tags: ['向前相容', '持久執行', '訊息代理', '死信佇列', '分區鍵'],
  sections: {
    'ch5-dataflow-through-databases': {
      conclusion:
        '寫入資料庫的程式負責編碼，讀取的程式負責解碼。同一個服務常平行跑多個實例；滾動升級（rolling upgrade）期間，新版寫入的值會被還沒升級的舊版讀到，所以資料庫不只要向後相容（backward compatibility），也要向前相容（forward compatibility）。舊版更新紀錄時，還要保留它看不懂的未知欄位（unknown fields）。',
      tradeoff: '多實例平行執行換來擴展與容錯（fault tolerance），代價是資料格式要雙向相容。',
      questions: [
        '滾動升級（rolling upgrade）期間，舊實例讀到新格式的資料會怎樣？',
        '舊版程式改一筆紀錄再寫回時，會不會把新版加的欄位弄丟？',
      ],
      examples: [
        {
          source: 'book',
          text: '書中提醒，同一個資料庫裡可能同時有幾毫秒前寫的值和好幾年前寫的值；程式升級了，舊資料不會跟著換成新格式。',
        },
      ],
    },
    'ch5-durable-execution-and-workflows': {
      conclusion:
        '跨服務的多步驟工作流程（workflow）無法包進一個資料庫交易（transaction）。持久執行（durable execution）把每次呼叫的結果記下來，失敗後重跑時跳過已成功的步驟，讓整個工作流程有恰好一次（exactly-once）的效果。但外部服務仍要提供冪等（idempotent）的 API，重跑時也要帶同一個唯一 ID。',
      tradeoff:
        '代價是工作流程的程式碼必須具確定性（deterministic），不能直接呼叫亂數或系統時鐘；修改工作流程的程式碼可能讓重跑出錯，較安全的做法是另外部署新版，讓進行中的工作流程繼續用舊版。',
      questions: [
        '工作流程（workflow）在扣款後、入帳前失敗，會怎樣？',
        '重跑時，呼叫外部付款 API 用的是同一個唯一 ID 嗎？',
        '改了工作流程（workflow）的步驟順序後，進行中的工作流程會怎麼處理？',
      ],
      examples: [
        {
          source: 'book',
          text: '書中的付款流程：先呼叫詐欺偵測服務，再刷信用卡，最後把款項存入銀行帳戶。中途失敗，可能刷了卡卻沒入帳；這三步跨三個服務，沒辦法放進同一個資料庫交易。',
        },
      ],
    },
    'ch5-message-brokers': {
      conclusion:
        '訊息代理（message broker）在服務之間暫存訊息。佇列（queue）裡的一則訊息只交給一個消費者（consumer）；發布到主題（topic）的一則訊息，每個訂閱者都會收到。許多代理在訊息被消費後就刪除；把訊息轉發出去的消費者，要保留未知欄位（unknown fields）。',
      tradeoff: '消費後即刪省空間，代價是無法重播過去的訊息；要做事件溯源（event sourcing），就得設定成無限期保存。',
      questions: [
        '這些訊息保存多久？新的消費者（consumer）上線時，能從頭重播嗎？',
        '這則訊息只要一個消費者（consumer）處理，還是每個訂閱者都要收到？',
      ],
      examples: [
        {
          source: 'book',
          text: '書中說，想用事件溯源，就要把代理設定成無限期保存訊息，而不是消費後就刪除。',
        },
      ],
    },
    'ch5-how-to-choose': {
      title: '資料庫、服務呼叫，還是訊息代理',
      conclusion:
        '經由資料庫傳資料時，兩個方向的相容都要，並保留未知欄位（unknown fields）；經由服務呼叫時，通常可假設伺服器先升級。需要緩衝、自動重送、一對多，或讓送出者不必知道接收者時，才用訊息代理（message broker）。',
      tradeoff: '更明確的相容規則與格式檢查工具，能避免改版出錯，代價是導入與營運成本。',
      questions: [
        '這條資料流需要哪個方向的相容：新程式讀舊資料、舊程式讀新資料，還是兩者都要？',
        '為什麼用遠端程序呼叫（RPC），而不是訊息代理（message broker）？或反過來？',
      ],
      examples: [
        {
          source: 'book',
          text: '書中列出訊息代理比直接呼叫多出的好處：接收者當機或過載時可以暫存訊息，能把訊息重送給當掉的行程，送出者不必知道接收者的位址，一則訊息也能交給多個接收者。',
        },
      ],
    },
    'ch12-messaging-systems': {
      conclusion:
        '選訊息系統先問兩件事：生產者（producer）比消費者（consumer）快時，是丟棄、緩衝，還是背壓（backpressure，擋住生產者）；節點當機時，會不會掉訊息。訊息代理（message broker）沒收到確認（acknowledgment）就會重送，所以確認若在路上遺失，同一則訊息會被處理兩次。',
      tradeoff:
        '寫入磁碟與確認後重送換來不掉訊息，但吞吐量（throughput）較低；把訊息分給多個消費者再加上重送，還會打亂順序。一則格式錯誤的訊息若讓消費者一再當機，要移到死信佇列（dead letter queue）才能解除阻塞。',
      questions: [
        '這個事件（event）掉一則，或處理兩次，對業務有什麼影響？',
        '進了死信佇列（dead letter queue）的訊息，誰負責看、怎麼補？',
      ],
      examples: [
        {
          source: 'book',
          text: '書中對比：感測器定期回報的讀數偶爾掉一筆無妨，下一筆很快就來；用來計數的事件（event）卻是每掉一則，計數就錯一次。',
        },
        {
          source: 'book',
          text: '書中的例子：生產者送出缺了必要欄位的 JSON，消費者一處理就當機、送不出確認；代理重送給下一個消費者，它也當機，如此無限循環，直到把這則訊息移到死信佇列。',
        },
      ],
    },
    'ch12-log-based-message-brokers': {
      conclusion:
        '日誌式訊息代理（log-based message broker，例如 Kafka）讀取時不刪訊息，消費者（consumer）只記下讀到哪個偏移量（offset），所以可以重播。順序只在同一個分區（partition）內成立，要照順序處理的事件（event）必須用同一個分區鍵（partition key）。日誌是有上限的緩衝，消費者落後超過保留期限（retention period），就會漏掉訊息。',
      tradeoff: '換來高吞吐量（throughput）、分區內保序與可重播；代價是平行處理的程度最多等於分區數，一則處理得慢的訊息會卡住同一分區後面的所有訊息。',
      questions: [
        '需要照順序處理的事件（event），用什麼當分區鍵（partition key）？',
        '消費者（consumer）落後多少會告警？訊息的保留期限（retention period）有幾天？',
      ],
      examples: [
        {
          source: 'book',
          text: '書中的例子：同一位使用者的事件要照順序處理，就以使用者 ID 當分區鍵；用昨天的偏移量另外啟動一份消費者，把輸出寫到別處，就能重新處理過去一天的訊息。',
        },
      ],
    },
  },
} as const satisfies TopicText<'Q12'>
