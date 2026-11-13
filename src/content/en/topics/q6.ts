import type { Translation } from '../../types'
import type { q6 as zh } from '../../zh-TW/topics/q6'

export const q6: Translation<typeof zh> = {
  title: 'Why keep extra copies of data just for reading?',
  summary: 'Store every change as an event and derive views for reading from it; materialized views, data cubes and indexes work the same way, making specific queries fast at the cost of more write work, and precomputed views and cubes cannot answer questions outside what they precompute.',
  tags: ['event sourcing', 'CQRS', 'materialized view', 'data cube', 'index'],
  sections: {
    'ch3-event-sourcing-and-cqrs': {
      conclusion: 'Event sourcing records every state change as an event appended to an event log, and treats that log as the source of truth. Command query responsibility segregation (CQRS) then derives several materialized views from the log, each optimized for one kind of read. A user’s command is validated first and becomes an event only if it is valid, so the consumers that build views cannot reject events.',
      tradeoff: 'Writes and reads can each use the representation that suits them, and a wrong view can be deleted and recomputed from the log; the cost is a whole extra layer of machinery for maintaining the event log and views.',
      questions: [
        'Can the state changes in this feature be described as a sequence of events?',
        'Where are commands validated, and what does the user see when one is rejected?',
        'If a materialized view is computed wrongly, can we delete it and rebuild it from the event log?',
      ],
      examples: [{ source: 'book', text: 'The book’s example is a conference booking system: individuals register and pay, companies book seats in bulk, seats are reserved for speakers, bookings are canceled and the organizer may change venues, so even counting the remaining seats is hard. Every change is stored as an event first, then views such as booking status, the organizer’s dashboard and the badge-printing file are updated.' }],
    },
    'ch3-event-sourcing-drawbacks': {
      title: 'Drawbacks of event sourcing',
      conclusion: 'When materialized views are recomputed from events, the processing must be deterministic: outside information such as exchange rates must be stored in the event itself. Events are immutable, which conflicts with a user’s right to have personal data deleted; reprocessing events must also avoid external side effects such as sending email.',
      tradeoff: 'Immutable events mean views can always be rebuilt, but deleting personal data becomes hard. Keeping personal data outside the events, or encrypting it with a key that can later be deleted, makes recomputation harder in turn.',
      questions: [
        'When we rebuild a view, will confirmation emails be sent again?',
        'When a user asks for their personal data to be deleted, what happens to the event log?',
        'Does event processing look up live outside data such as exchange rates? Would recomputing on another day give the same result?',
      ],
      examples: [{ source: 'book', text: 'In the book’s example, fetching a live exchange rate while processing an event means recomputing the view on another day gives a different result; and when rebuilding a materialized view, you probably do not want to send the confirmation emails again.' }],
    },
    'ch4-materialized-views-and-data-cubes': {
      conclusion: 'A materialized view is an actual copy of a query’s results written to disk; a data cube precomputes aggregates along several dimensions. Both make fixed queries very fast but are less flexible than the raw data, so most data warehouses keep the raw data and use them only as a speed-up for particular queries.',
      tradeoff: 'Precomputed aggregates spare queries from scanning millions of rows, but they must be updated whenever the underlying data changes, and they cannot answer questions outside their dimensions.',
      questions: [
        'Does this report read from a materialized view or data cube, or query the raw data live?',
        'If we add a filter, for example by price, can the existing data cube answer it?',
      ],
      examples: [{ source: 'book', text: 'In the book’s example, a data cube instantly answers total sales per store yesterday, but cannot tell what share of sales comes from items priced over $100, because price is not one of its dimensions.' }],
    },
    'ch4-storage-and-indexing-for-oltp': {
      conclusion: 'In online transaction processing (OLTP), applications read and write a few records at a time. An index is an additional structure derived from the primary data that helps particular queries find data faster; adding or removing an index does not change the data itself. Every index takes disk space and slows down writes, so databases do not index everything by default; indexes are chosen from the application’s typical queries.',
      tradeoff: 'More indexes speed up more queries, but every write must also update every index; writes can hardly be faster than simply appending to the end of a file.',
      questions: [
        'Is this new filter or sort order backed by an index?',
        'How much slower will writes get, and how much more space will this index take?',
        'If the data doubles, how much slower will this query get?',
      ],
      examples: [{ source: 'book', text: 'The book builds the simplest possible database from two bash functions: a write just appends a key and value to the end of a file, so it is fast; a read scans the whole file for the last match, so doubling the records doubles the lookup time. Indexes exist for exactly this kind of read.' }],
    },
  },
}
