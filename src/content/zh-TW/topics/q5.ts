import type { TopicText } from '../../types'

export const q5 = {
  title: '資料要存幾份、格式要管多嚴？',
  summary: '正規化或反正規化、讀取時或寫入時檢查格式，決定了改格式時要動多少資料、多少程式。',
  tags: ['正規化', '反正規化', '讀時 schema', '寫時 schema', '結構遷移'],
  sections: {
    'ch3-trade-offs-of-normalization': {
      conclusion: '正規化（normalization）的資料只存一份：寫入快，讀取要 join（查詢時把多張表的資料接起來）而較慢。反正規化（denormalization）讀取快，寫入時要更新每份副本；這些副本是一種衍生資料（derived data），要有流程負責更新。營運資料庫與中小規模的系統，通常先正規化。',
      tradeoff: '反正規化讓讀取快，代價是多佔空間、要更新每份副本，更新到一半當掉時還可能留下不一致；分析系統（analytical system）以讀為主、批次更新，較適合反正規化。',
      questions: ['這份冗餘資料由誰、在什麼時候更新？', '更新多份副本到一半當掉時，會留下不一致嗎？有交易（transaction）保護嗎？'],
      examples: [{ source: 'book', text: '書中用履歷上的公司 logo 說明：每份履歷都存 logo 網址的話，換 logo 時要找出所有舊網址逐一更新；建立組織實體、履歷只存它的 ID，換 logo 就只改一處。' }],
    },
    'ch3-schema-flexibility-in-the-document-model': {
      conclusion: '文件資料庫不是沒有 schema：讀資料的程式仍假設某種結構，只是讀取時才解讀，稱為讀時 schema（schema-on-read）；關聯式資料庫在寫入時就檢查，稱為寫時 schema（schema-on-write）。差別在改格式時最明顯：前者每個讀取點都要處理舊格式，後者要做結構遷移（schema migration）。',
      tradeoff: '讀時 schema 改格式快，適合結構不一的資料，代價是舊格式會一直留在讀取的程式裡；寫時 schema 讓資料一致，代價是大表遷移慢，是營運上的挑戰。',
      questions: ['改資料格式時，舊資料是一次遷移，還是讀取時再轉換？', '大表的結構遷移（schema migration）要跑多久？能不停機嗎？'],
      examples: [{ source: 'book', text: '書中把全名拆成名和姓：文件資料庫直接寫新格式，讀到舊文件時由程式補上名字；關聯式資料庫則先加欄位、再用 UPDATE 填值，而 UPDATE 在大表上要重寫每一列，可能很慢。' }],
    },
    'ch5-the-merits-of-schemas': {
      conclusion: 'schema 是一定保持最新的文件，因為解碼資料一定要用到它。保存每個版本的 schema，就能在部署前自動檢查變更是否向後相容（backward compatibility）與向前相容（forward compatibility）。同時並存的格式越少，營運越簡單。',
      tradeoff: '以 schema 為基礎的二進位格式精簡、相容規則清楚，代價是資料要先解碼，人才看得懂。',
      questions: ['schema 變更在部署前，有自動檢查向後相容（backward compatibility）與向前相容（forward compatibility）嗎？', '誰負責擋下不相容的變更？', '現在同時有幾種資料格式在用？'],
      examples: [{ source: 'book', text: '書中說，Protocol Buffers 與 Avro 這類以 schema 為基礎的格式可以省略欄位名稱，比各種二進位 JSON 精簡得多；對靜態型別的語言，還能從 schema 產生程式碼，在編譯時檢查型別。' }],
    },
  },
} as const satisfies TopicText<'Q5'>
