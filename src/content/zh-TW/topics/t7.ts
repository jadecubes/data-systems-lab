import type { TopicText } from '../../types'

export const t7 = {
  title: '讓約束在並行下仍成立',
  summary: '各自看見「還有空位」不代表一起提交仍有空位；真正不可違反的規則要在寫入點執行。',
  tags: ['一致性', '寫偏斜', '唯一約束', '線性一致性'],
  sections: {
    'ch8-consistency': {
      conclusion: '交易（transaction）的一致性（consistency）指應用定義的不變條件（invariant）在每次提交後都成立，例如會計帳目借貸平衡。資料庫只會擋你宣告成約束的規則（唯一、外鍵、check）；宣告不了的複雜規則，要靠應用程式把交易寫對。',
      tradeoff: '寫得成約束的規則由資料庫保證；寫不成的只能靠程式，並行時較容易漏擋。',
      questions: ['這條規則有宣告成資料庫約束嗎？', '沒有的話，是哪段程式在擋？兩人同時操作還擋得住嗎？'],
      examples: [{ source: 'book', text: '書中的例子：會計系統裡，所有帳戶的借貸加總必須平衡。' }],
    },
    'ch8-more-examples-of-write-skew': {
      conclusion: '寫偏斜（write skew）發生在兩筆交易（transaction）讀取同一條件，卻寫入不同資料列；各自看見可行，合起來就違反一致性（consistency）規則。只鎖定自己要寫的列，可能擋不住。',
      tradeoff: '較強的隔離（isolation）可阻止這種並行異常，但會增加等待、衝突或重試（retry）。',
      questions: ['兩個人同時看到「還有一個名額」時，能否都提交？', '檢查規則涉及的所有資料有被同一筆交易（transaction）保護嗎？'],
      examples: [{ source: 'book', text: '書中列出兩個使用者同時搶同一個名稱的情況：若只先查「還沒人用」，兩人都可能通過檢查；資料庫唯一約束（uniqueness constraint）才能在提交時分出勝者。' }],
    },
    'ch13-enforcing-constraints': {
      conclusion: '唯一約束（uniqueness constraint）要在寫入當下就擋下重複，搶同一個值（例如同一個使用者名稱）的請求就得交給同一個決定者依序處理：單一領導者（leader），或這個值所屬的分片（shard）。各節點先各自接受寫入、事後才互相同步的非同步多主複製（multi-leader replication）做不到。',
      tradeoff: '同一個值的請求都得經過同一個決定者，即使用戶端在地球另一端；這限制吞吐量，決定者暫時不可用時，寫入只能等待或失敗。',
      questions: ['兩個人同時建立同一筆資料（例如同一個名稱）時，誰會成功？失敗的人看到什麼訊息？', '負責決定的節點暫時不可用時，寫入要等待還是直接失敗？'],
      examples: [{ source: 'book', text: '書中的例子：多人搶同一個使用者名稱。每個請求依名稱分到同一個日誌分片，處理程式依序讀取：名稱還沒被占用就記下並回覆成功，已被占用就回覆拒絕。' }],
    },
    'ch10-relying-on-linearizability': {
      conclusion: '線性一致性（linearizability）讓每次讀寫看起來都在某一瞬間生效，之後的讀取一定看得到。需要它的情況：鎖與選出唯一領導者（leader）、名稱或座位不能重複，以及先寫檔案、再經另一條通道（例如訊息佇列）通知別人去讀。比分晚幾秒顯示則不需要；能事後補償（compensation）的規則也可以放寬。',
      tradeoff: '線性一致性提供清楚的單一順序，但增加跨地區延遲，網路故障時可用性（availability）也會受影響。',
      questions: ['這個判斷能容忍短暫舊值嗎？', '若不能，哪一筆讀取與寫入需要同一順序？'],
      examples: [{ source: 'book', text: '書中的例子：使用者上傳影片，網頁伺服器先把檔案寫進檔案儲存，再把轉檔指令放進訊息佇列。佇列可能比檔案儲存內部的複製還快，轉檔程式取檔時拿到舊版或找不到檔案；轉的若是舊版，原檔和轉檔結果就永久對不上。' }],
    },
  },
} as const satisfies TopicText<'T7'>
