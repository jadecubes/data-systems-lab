import type { TopicText } from '../../types'

export const q16 = {
  title: '資料壞了，我們多快會發現？',
  summary: '資料損壞遲早會發生；要持續比對、定期試著還原備份，而不是等下游出事才發現。',
  tags: ['資料損壞', '稽核', '完整性', '備份'],
  sections: {
    'ch13-trust-but-verify': {
      conclusion: '資料損壞（data corruption）遲早會發生，連成熟的資料庫都出過違反約束的 bug。要持續稽核（auditing）整條衍生資料（derived data）管線的完整性（integrity）、定期試著從備份（backup）還原，並把系統設計成事後能重現當時發生了什麼。',
      tradeoff: '持續稽核、另外衍生一份來比對，都要花資源；不檢查，就要等損壞造成下游損害才發現，那時追查更難也更貴。',
      questions: ['我們上次實際從備份（backup）還原是什麼時候？成功了嗎？', '有沒有定期比對衍生資料（derived data）和來源是否一致？', '出錯時，我們能重現是哪個輸入、哪個版本的程式造成的嗎？'],
      examples: [
        { source: 'book', text: '書中提到，HDFS 與 Amazon S3 不完全信任磁碟：背景程序持續讀回檔案、與其他副本比對。同樣地，不定期試著還原，可能到資料遺失（data loss）時才發現備份是壞的。' },
        { source: 'book', text: '書中也舉出，MySQL 過去曾無法正確維持唯一約束（uniqueness constraint），PostgreSQL 的可序列化（serializable）隔離也曾出現寫偏斜（write skew）。' },
      ],
    },
  },
} as const satisfies TopicText<'Q16'>
