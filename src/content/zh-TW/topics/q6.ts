import type { TopicText } from '../../types'

export const q6 = {
  title: '為何要另存一份資料給讀取用？',
  summary: '把每個變更存成事件，再衍生出各種讀取用的視圖；物化視圖、資料立方體和索引也一樣，讓特定查詢變快，代價是寫入工作變多；預先彙總的視圖與立方體還回答不了範圍外的問題。',
  tags: ['事件溯源', '命令查詢職責分離', '物化視圖', '資料立方體', '索引'],
  sections: {
    'ch3-event-sourcing-and-cqrs': {
      conclusion: '事件溯源（event sourcing）把每個狀態改變記成事件（event），附加在事件日誌（event log）尾端，並以日誌為事實來源；命令查詢職責分離（CQRS）再從日誌衍生出多個物化視圖（materialized view），各自為一種讀取最佳化。使用者的命令（command）要先驗證，通過了才成為事件，所以建視圖的下游不能拒絕事件。',
      tradeoff: '寫入與讀取可以各自選最適合的形式，視圖算錯了也能刪掉、從日誌重算；代價是多了一整套事件日誌與視圖維護的機制。',
      questions: [
        '這個功能的狀態改變，能用一連串事件（event）描述嗎？',
        '命令（command）在哪裡驗證？被拒絕時使用者看到什麼？',
        '物化視圖（materialized view）算錯時，能刪掉後從事件日誌（event log）重算嗎？',
      ],
      examples: [{ source: 'book', text: '書中舉會議報名系統：個人報名付款、公司批次訂位、保留講者座位、取消、主辦方換場地都會改變名額，光算剩餘座位就很難。每個改變先存成事件，再分別更新預訂狀態、主辦方儀表板和名牌印製檔等視圖。' }],
    },
    'ch3-event-sourcing-drawbacks': {
      title: '事件溯源的缺點',
      conclusion: '從事件（event）重算物化視圖（materialized view）時，處理邏輯必須具確定性（deterministic）：匯率這類外部資訊要放進事件本身。事件不可變（immutable），和使用者刪除個人資料（personal data）的權利衝突；重新處理事件時，也要避開寄信這類對外的副作用（side effect）。',
      tradeoff: '不可變的事件讓視圖隨時能重建（rebuild），代價是刪除個人資料困難。把個人資料存在事件之外，或用之後可刪除的金鑰加密，又會讓重算變難。',
      questions: [
        '重建（rebuild）視圖時，會不會重寄確認信？',
        '使用者要求刪除個人資料（personal data）時，事件日誌（event log）怎麼處理？',
        '處理事件（event）時有沒有去外部查即時資料，例如匯率？換一天重算，結果還一樣嗎？',
      ],
      examples: [{ source: 'book', text: '書中例子：處理事件時去抓即時匯率，換一天重算視圖就會得到不同的結果；重建物化視圖時，大概也不想再寄一次確認信。' }],
    },
    'ch4-materialized-views-and-data-cubes': {
      conclusion: '物化視圖（materialized view）把查詢結果實際存在磁碟上；資料立方體（data cube）依多個維度（dimension）預先算好彙總（aggregate）。兩者讓固定的查詢極快，但不如原始資料有彈性，所以多數資料倉儲（data warehouse）保留原始資料，只把它們當特定查詢的加速。',
      tradeoff: '預先彙總讓查詢不必掃數百萬列，代價是底層資料每次變動都要跟著更新，而且回答不了不在維度裡的問題。',
      questions: [
        '這份報表讀的是物化視圖（materialized view）或資料立方體（data cube），還是即時查原始資料？',
        '若要多一個篩選條件，例如依售價，現有的資料立方體（data cube）回答得了嗎？',
      ],
      examples: [{ source: 'book', text: '書中例子：資料立方體能立刻回答昨天各店的總銷售，卻算不出售價超過 100 美元的商品佔銷售多少，因為價格不是它的維度。' }],
    },
    'ch4-storage-and-indexing-for-oltp': {
      conclusion: '線上交易處理（OLTP）中，應用程式每次只讀寫少量紀錄。索引（index）是從主要資料衍生的額外結構，讓特定查詢更快找到資料；新增或移除索引不改變資料本身。每個索引都佔磁碟空間、拖慢寫入，所以資料庫不會預設替所有東西建索引，要依應用的典型查詢挑選。',
      tradeoff: '多建索引讓更多查詢變快，代價是每次寫入都要一併更新索引；寫入很難比單純附加到檔案尾端更快。',
      questions: [
        '這個新的篩選或排序條件，有索引（index）支撐嗎？',
        '加這個索引（index），寫入會慢多少、多佔多少空間？',
        '資料量翻倍時，這個查詢會慢多少？',
      ],
      examples: [{ source: 'book', text: '書中用兩個 bash 函式做出最簡單的資料庫：寫入只把鍵值附加到檔案尾端，所以很快；讀取要從頭掃到尾找最後一筆，紀錄數加倍、查詢時間也加倍。索引就是為了這種讀取而存在。' }],
    },
  },
} as const satisfies TopicText<'Q6'>
