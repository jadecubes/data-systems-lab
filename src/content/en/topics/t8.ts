import type { Translation } from '../../types'
import type { t8 as zh } from '../../zh-TW/topics/t8'

export const t8: Translation<typeof zh> = {
  title: 'Separate late results from wrong results',
  summary: 'A delayed result and an incorrect result pose different risks. Define how long users can wait and what must never be wrong.',
  tags: ['timeliness', 'integrity', 'synchronous coordination', 'compensation'],
  sections: {
    'ch13-timeliness-and-integrity': {
      conclusion: 'Timeliness is about when users see the latest state; a violation is temporary and goes away if you read again later. Integrity means no data is lost, duplicated, contradictory, or wrong; a violation is permanent and needs explicit checking and repair. In most applications integrity matters far more than timeliness.',
      tradeoff: 'Asynchronous processing can acknowledge work sooner and improve availability, at the cost of results appearing later. Only timeliness is given up: a lost or doubly applied event still breaks integrity, so delivery must be reliable and duplicates suppressed.',
      questions: ['How long can users wait to see the result?', 'If it arrives late, how will we verify the final state is correct?'],
      examples: [{ source: 'book', text: 'In the book’s example, a credit-card statement that does not yet show the last 24 hours of transactions is normal, since banks settle asynchronously; but charging the cardholder without paying the merchant makes money vanish, and that breaks integrity.' }],
    },
    'ch13-how-to-choose': {
      title: 'When to coordinate and when to compensate',
      conclusion: 'Rejecting a violating write at the moment it happens requires synchronous coordination: conflicting requests all go through one decider. If the cost of an apology and compensation is acceptable (a business decision), accept the write, check afterwards, and compensate, validating only before a step that cannot be undone. Both approaches still need integrity; they differ only in when the constraint is enforced.',
      tradeoff: 'Synchronous coordination means fewer apologies for broken rules but lower performance and availability, and so more apologies for outages; compensation lets work proceed, at the cost of an apology, refund, or restock each time a rule is broken.',
      questions: ['Which step cannot be undone, so the check must happen before it?', 'If a conflict appears later, are refunds or rearrangements acceptable?'],
      examples: [{ source: 'book', text: 'In the book’s example, airlines overbook seats and hotels overbook rooms on purpose, with compensation ready (refunds, upgrades, a free room at a nearby hotel); those processes must exist anyway for flights cancelled by weather.' }],
    },
  },
}
