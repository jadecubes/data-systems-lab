import type { Translation } from '../../types'
import type { t9 as zh } from '../../zh-TW/topics/t9'

export const t9: Translation<typeof zh> = {
  title: 'Old and new versions must coexist',
  summary: 'A deployment is not instantaneous. New and old code will read and write records created at different times.',
  tags: ['backward compatibility', 'forward compatibility', 'rolling upgrade', 'unknown fields'],
  sections: {
    'ch5-intro-why-versions-coexist': {
      title: 'Why old and new versions coexist',
      conclusion: 'A rolling upgrade leaves old and new nodes running together. Backward compatibility lets new code read old data; forward compatibility lets old code read new data. Both matter because data does not change version when code is deployed.',
      tradeoff: 'Letting versions coexist avoids downtime during deployment, but limits how freely a format can change in one step.',
      questions: ['Will an old node read data written by a new node during deployment?', 'After rollback, can the old version still read records left by the new one?'],
      examples: [{ source: 'book', text: 'In the book’s example, new code adds a field to a record; old code reads the record, updates another field, and writes it back, and if it keeps only the fields it knows, the new field is lost.' }],
    },
    'ch5-data-encoding-and-evolution-for-rpc': {
      conclusion: 'RPC servers usually upgrade before clients. Requests therefore need backward compatibility and responses need forward compatibility. Adding optional request fields or unknown fields to responses is usually safe, provided old clients ignore the extras.',
      tradeoff: 'External clients may never upgrade; a breaking change then means maintaining several API versions side by side, possibly indefinitely.',
      questions: ['Does this API change only add optional fields, or will it break old clients?', 'If multiple API versions are needed, how long must each remain supported?'],
      examples: [{ source: 'book', text: 'The book notes that when several API versions coexist, RESTful APIs often put the version number in the URL or the HTTP Accept header; services that identify clients by API key can instead store each client’s chosen version on the server.' }],
    },
  },
}
