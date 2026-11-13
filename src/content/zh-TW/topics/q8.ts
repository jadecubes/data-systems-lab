import type { TopicText } from '../../types'

export const q8 = {
  title: '資料要拆到多台機器嗎？',
  summary: '分片讓資料量和寫入量超出單機時還能擴展，但分區鍵很難再改、跨分片的操作變慢，搬動分片本身也可能引發故障。',
  tags: ['分片', '分區鍵', '分散式交易', '再平衡', '連鎖故障'],
  sections: {
    'ch7-pros-and-cons-of-sharding': {
      conclusion: '分片（sharding）是在資料量或寫入量超出單機時，把資料和寫入分散到多個節點；問題若只是讀取量，讓副本分擔讀取即可。單機撐得住就別分片：要選一個事後很難更改的分區鍵（partition key），不知道紀錄在哪個分片就得搜尋所有分片，跨分片的寫入還需要分散式交易（distributed transaction）。',
      tradeoff: '分片讓資料量與寫入量能水平擴展（horizontal scaling），代價是複雜度，以及跨分片的查詢、join（把多張表的資料接起來）與交易（transaction）都變慢。',
      questions: [
        '瓶頸是資料量、寫入量，還是只是讀取量？真的需要分片（sharding）嗎？',
        '分區鍵（partition key）選什麼？之後改得了嗎？',
        '有哪些查詢或交易（transaction）會跨分片（shard）？',
      ],
      examples: [{ source: 'book', text: '書中提醒，問題若只是讀取量太大，不一定要分片，讓多個副本分擔讀取就夠了；分片是重量級方案，單機處理得了，通常就維持單一分片。' }],
    },
    'ch7-operations-automatic-versus-manual-rebalancing': {
      conclusion: '再平衡（rebalancing）把分片（shard）搬到別的節點。全自動省下日常營運，但很難預測：搬大量資料會加重網路與節點負載；和自動故障偵測一起用時，一台暫時變慢的節點被誤判為掛掉，負載移到其他節點，可能引發連鎖故障（cascading failure）。',
      tradeoff: '自動化省人力，代價是難以預測的營運意外；由人確認後才生效較慢，但能避開意外，已知的流量高峰也適合事先手動再平衡。',
      questions: [
        '再平衡（rebalancing）是自動進行，還是要人確認？',
        '已知的促銷或活動前，要提前多久通知你們預先調整分片（shard）？',
      ],
      examples: [{ source: 'book', text: '書中舉例：預期 Cyber Monday 促銷或熱門賽事開賣會帶來流量高峰時，適合事先手動再平衡。' }],
    },
  },
} as const satisfies TopicText<'Q8'>
