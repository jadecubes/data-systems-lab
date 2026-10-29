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
      tradeoff: 'Version coexistence avoids an all-at-once deployment but limits how freely a format can change in one step.',
      questions: ['Will an old node read data written by a new node during deployment?', 'After rollback, can the old version still read records left by the new one?'],
      examples: [{ source: 'book', text: 'The book warns that old code can read a record with a new field and then encode only the fields it knows, silently deleting the new data.' }],
    },
    'ch5-data-encoding-and-evolution-for-rpc': {
      conclusion: 'RPC servers usually upgrade before clients. Requests therefore need backward compatibility and responses need forward compatibility. Adding optional request fields or unknown fields to responses is usually safe, provided old clients ignore the extras.',
      tradeoff: 'Compatibility lets clients upgrade on their own schedule. External clients may remain old for years, so a breaking change can require multiple API versions.',
      questions: ['Does this API change only add optional fields, or will it break old clients?', 'If multiple API versions are needed, how long must each remain supported?'],
      examples: [{ source: 'book', text: 'The book explains the RPC upgrade order: servers can first accept an optional request parameter and add a response field; old clients continue working if they ignore the extra response field.' }],
    },
  },
}
