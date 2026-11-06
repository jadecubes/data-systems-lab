import type { Translation } from '../../types'
import type { q1 as zh } from '../../zh-TW/topics/q1'

export const q1: Translation<typeof zh> = {
  title: 'Why keep operational and analytical data apart?',
  summary: 'The database that users act on and the data that analysts query serve different people; separating them keeps reports from slowing the product, at the cost of report figures arriving later.',
  tags: ['operational system', 'analytical system', 'data warehouse', 'data silos'],
  sections: {
    'ch1-operational-versus-analytical-systems': {
      conclusion: 'Data is created in an operational system: application code reads and writes its own database in response to user actions. An analytical system serves business analysts and data scientists; it holds a read-only copy of operational data, optimized for analytic queries.',
      tradeoff: 'Two systems keep analytics from slowing down users, at the cost of a pipeline that moves data from operational to analytical systems, and data engineers to maintain it.',
      questions: ['Is this feature for end users or for internal analysts?', 'Should this data be read from the operational system or from the copy in the analytical system?'],
      examples: [{ source: 'book', text: 'The book divides people who use data into three groups: backend engineers, whose services read and write the operational database as users act; business analysts, who produce reports for management decisions; and data scientists, who look for new insights or build features such as recommendations. The last two look at data but usually do not change it.' }],
    },
    'ch1-data-warehousing': {
      conclusion: 'Analysts do not query operational databases directly. ETL (extract–transform–load) copies data from each operational system into a data warehouse, breaking down data silos so one query can combine them. HTAP systems, which handle transactions and analytics together, do not replace the warehouse: a company may run hundreds of operational databases but usually has one warehouse.',
      tradeoff: 'A warehouse keeps analytics off operational systems and combines data across them, at the cost of building and running ETL, and of figures that trail the operational systems.',
      questions: ['How often is report data synced from the operational databases to the data warehouse?', 'How old can a figure the user sees on a report be?'],
      examples: [{ source: 'book', text: 'The book gives four reasons not to let analysts query operational databases directly: data is spread across tens to hundreds of systems and hard to combine; a layout suited to transactions does not suit analysis; analytic queries are expensive and slow down other users; and operational systems may sit on a separate network for security or compliance.' }],
    },
  },
}
