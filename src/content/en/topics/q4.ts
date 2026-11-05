import type { Translation } from '../../types'
import type { q4 as zh } from '../../zh-TW/topics/q4'

export const q4: Translation<typeof zh> = {
  title: 'Does it survive faults, and is it easy to operate?',
  summary: 'Fault tolerance covers only the faults chosen in advance, and only drills prove it works; the more you automate, the more operators need to see what is happening and take over.',
  tags: ['fault tolerance', 'single point of failure', 'fault injection', 'operability', 'observability'],
  sections: {
    'ch2-fault-tolerance': {
      conclusion: 'Fault tolerance means the system keeps providing service when certain faults occur; a part whose failure stops the whole system is a single point of failure. Fault tolerance always covers a certain number of certain kinds of fault, such as one node in three. Deliberate fault injection, such as killing processes at random, keeps the recovery machinery exercised.',
      tradeoff: 'Tolerating more kinds of fault, and more at once, raises reliability and cost; tolerating any fault at all is impossible. For faults that cannot be undone, such as a data breach, prevention beats tolerance.',
      questions: ['Which faults is the design meant to tolerate, and how many at once?', 'Where are the single points of failure?', 'Have we drilled it by actually shutting machines down? Does the takeover miss or repeat any work?'],
      examples: [{ source: 'book', text: 'In the book’s example, the machine updating timelines crashes partway through delivery; another must take over without missing or repeating any post, that is, with exactly-once semantics.' }],
    },
    'ch2-operability-making-life-easy-for-operations': {
      conclusion: 'Good operability makes routine tasks easy and system behavior predictable, so the operations team can focus on higher-value work. Automation cuts both ways: what it cannot handle is often the most complex case, so the more you automate, the more skill operators need.',
      tradeoff: 'Automation reduces manual work, but automation that goes wrong is often harder to troubleshoot than manual operation. The system should offer monitoring and observability, a clear model of “if I do X, Y will happen”, and let people override defaults and take control.',
      questions: ['When something goes wrong, what can operators see, and can they intervene by hand?', 'Which situations can automation not handle, so a person must step in?', 'If one machine is taken down for maintenance, is the service interrupted?'],
      examples: [{ source: 'book', text: 'The book lists ways a data system can help operations: monitoring key metrics and supporting observability tools; not depending on individual machines, so one can be taken down for maintenance; good documentation and an operational model of the form “if I do X, Y will happen”; good defaults that administrators can override; and self-healing that administrators can still control manually.' }],
    },
  },
}
