import type { TopicText } from '../../types'

export const q9 = {
  title: '隔離等級怎麼選？',
  summary: '並行的交易會造成讀偏斜、遺失更新和寫偏斜；依問題選防法，跑很久的報表和備份至少要從一致的快照讀。',
  tags: ['隔離等級', '快照隔離', '遺失更新', '寫偏斜', '可序列化'],
  sections: {
    'ch8-snapshot-isolation-and-repeatable-read': {
      conclusion: '讀已提交（read committed）仍會有讀偏斜（read skew）：同一次查看裡，部分資料是轉帳前、部分是轉帳後。對使用者通常只是暫時的，重新整理就好；但跑好幾小時的備份（backup）、分析查詢和完整性（integrity）檢查混到不同時間點的資料，結果就永久不一致或沒有意義。快照隔離（snapshot isolation）讓每個交易（transaction）只讀它開始時已提交的一致快照。',
      tradeoff: '快照隔離讓長時間的讀取不擋寫入、結果一致，代價是資料庫要保留舊版本，而且擋不住寫偏斜（write skew）。',
      questions: [
        '我們的備份（backup）和報表查詢，是在快照隔離（snapshot isolation）下跑的嗎？',
        '查詢跑好幾小時，這段期間的寫入會不會混進結果？',
      ],
      examples: [{ source: 'book', text: '書中例子：Aaliyah 在兩個帳戶各有 500 美元，一筆 100 美元的轉帳進行到一半時她查看餘額，一個帳戶已扣款、另一個還沒入帳，總額看起來少了 100 美元。若跑好幾小時的備份出現這種不一致，從它還原後就變成永久的。' }],
    },
    'ch8-how-to-choose': {
      title: '依問題選防法',
      conclusion: '先認出問題再選防法：遺失更新（lost update）優先用資料庫的原子操作（atomic operation）；寫偏斜（write skew）要由資料庫自動防止，只能用可序列化（serializable）隔離，部分情形可用唯一約束（uniqueness constraint）；訊息處理要恰好一次（exactly-once），讓處理冪等（idempotent）即可：訊息 ID 和處理結果寫在同一個交易（transaction）裡。備份（backup）與分析至少要快照隔離（snapshot isolation）；各資料庫的隔離等級（isolation level）名稱不一致，要看實際行為。',
      tradeoff: '可序列化或分散式交易（distributed transaction）這類越強的保證越貴，會降低吞吐量（throughput）或提高中止（abort）率；越便宜的做法，越依賴工程師每處都沒漏寫。',
      questions: [
        '這個功能可能出現遺失更新（lost update），還是寫偏斜（write skew）？',
        '我們選了哪種防法？為什麼不用可序列化（serializable）隔離？',
        '資料庫文件寫的隔離等級（isolation level），實際擋得住哪些問題？',
      ],
      examples: [{ source: 'book', text: '書中提到：只是為了訊息處理的恰好一次，不必用分散式交易；在處理訊息的同一個交易裡記下訊息 ID、加上唯一約束，讓處理冪等即可。' }],
    },
  },
} as const satisfies TopicText<'Q9'>
