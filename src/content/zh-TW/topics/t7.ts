import type { TopicText } from '../../types'

export const t7 = {
  title: '讓約束在並行下仍成立',
  summary: '各自看見「還有空位」不代表一起提交仍有空位；真正不可違反的規則要在寫入點執行。',
  tags: ['一致性', '寫偏斜', '唯一約束', '線性一致性'],
  sections: {
    'ch8-consistency': {
      conclusion: '交易的一致性（consistency）指應用定義的不變條件在提交前後都成立，例如帳務借貸總額相等。資料庫能執行特定約束，但跨多筆資料的業務規則仍要由應用與交易設計正確表達。',
      tradeoff: '只檢查單筆欄位容易，跨資料的不變條件需要更強的交易安排與測試。',
      questions: ['哪些規則提交後永遠不能違反？', '這些規則在哪個寫入點被檢查？'],
      examples: [{ source: 'book', text: '書中用會計帳目說明：若一筆轉帳從一個帳戶扣款，另一個帳戶必須收到相同金額；這是應用要求的不變條件。' }],
    },
    'ch8-more-examples-of-write-skew': {
      conclusion: '寫偏斜（write skew）發生在兩筆交易讀取同一條件，卻寫入不同資料列；各自看見可行，合起來就違反一致性（consistency）規則。只鎖定自己要寫的列，可能擋不住。',
      tradeoff: '較強隔離可阻止這種並行異常，但會增加等待、衝突或重試。',
      questions: ['兩個人同時看到「還有一個名額」時，能否都提交？', '檢查規則涉及的所有資料有被同一交易保護嗎？'],
      examples: [{ source: 'book', text: '書中列出兩個使用者同時搶同一個名稱的情況：若只先查「還沒人用」，兩人都可能通過檢查；資料庫唯一約束才能在提交時分出勝者。' }],
    },
    'ch13-enforcing-constraints': {
      conclusion: '唯一約束（uniqueness constraint）應由同一個能決定寫入順序的地方執行。若相互衝突的請求分散到不同節點，必須讓同一鍵的競爭者會合，才能確保一致性（consistency）。',
      tradeoff: '同鍵協調保住硬性規則，但熱鍵可能成為瓶頸，分區期間也可能拒絕寫入。',
      questions: ['兩筆相同鍵的寫入是否會碰到同一個約束？', '若協調點暫時不可用，應等待還是拒絕？'],
      examples: [{ source: 'book', text: '書中舉例：把相同使用者名稱的請求送到同一個分區，該分區按順序處理並選出唯一成功者；若各自先在不同副本確認「可用」，會同時答應。' }],
    },
    'ch10-relying-on-linearizability': {
      conclusion: '線性一致性（linearizability）讓讀寫看起來在單一瞬間生效，適合需要全域最新結果的鎖、唯一名稱或權限判斷。並非所有頁面都需要它；先找出真正依賴即時順序的操作。',
      tradeoff: '線性一致性提供清楚的單一順序，但跨地區延遲和網路故障時可用性會受影響。',
      questions: ['這個判斷能容忍短暫舊值嗎？', '若不能，哪一筆讀取與寫入需要同一順序？'],
      examples: [{ source: 'book', text: '書中以檔案儲存與影片轉碼說明：檔案更新後若工作者讀到舊版，可能對錯誤的輸入轉碼；需要決定這項流程是否依賴最新版本。' }],
    },
  },
} as const satisfies TopicText<'T7'>
