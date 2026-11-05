import type { Translation } from '../../types'
import type { t1 as zh } from '../../zh-TW/topics/t1'

export const t1: Translation<typeof zh> = {
  title: 'Make reliability a requirement',
  summary: 'Features say what a system does; reliability says which outcomes are acceptable when it fails and how to tell whether it meets that standard.',
  tags: ['nonfunctional requirements', 'reliability', 'staged rollout', 'data loss'],
  sections: {
    'ch2-intro-functional-and-nonfunctional-requirements': {
      title: 'Functional and nonfunctional requirements',
      conclusion: 'Nonfunctional requirements matter as much as features: an app that is unbearably slow or unreliable is as good as useless. “The system must be reliable” cannot be verified; state tolerable downtime and data loss, and how to measure them.',
      tradeoff: 'Stricter targets usually cost more in redundancy, testing, and operations. State acceptable failure first so the tradeoff is explicit.',
      questions: ['Which data must never be lost on failure?', 'How long can the service be down and still be acceptable to users?'],
      examples: [{ source: 'book', text: 'The book describes functional requirements as which screens and buttons an app needs and what each operation does; speed, reliability, security, compliance, and maintainability often go unwritten because they seem obvious.' }],
    },
    'ch2-humans-and-reliability': {
      conclusion: 'Human error is not the cause of an incident but a symptom of problems in the wider system and organization; blaming individuals does not help. Reliability comes from thorough testing, staged rollout, fast rollback of configuration changes, and clear monitoring, which limit the impact of mistakes.',
      tradeoff: 'Testing and resilience cost time and money, and organizations often choose features first; when a preventable mistake happens, the problem is usually priorities, not the person.',
      questions: ['Will a configuration error be found before it affects everyone?', 'Can we return quickly to the previous working version?'],
      examples: [{ source: 'book', text: 'The book cites a study of large internet services: configuration changes by operators were the leading cause of outages, while hardware played a part in only 10–25% of them.' }],
    },
    'ch2-how-important-is-reliability': {
      conclusion: 'Reliability is not only for nuclear plants or air traffic control; ordinary business software must be reliable too. Many applications can tolerate a short outage, but permanent data loss or wrong numbers are a disaster and can even punish innocent people.',
      tradeoff: 'You can trade some reliability for lower development cost, for example in a prototype for an unproven market, but know exactly where you cut corners and what that could cost.',
      questions: ['Who bears the cost of a wrong record?', 'Can a missing or incorrect record be audited and corrected?'],
      examples: [{ source: 'book', text: 'The book recounts the UK Post Office Horizon scandal: between 1999 and 2019, hundreds of branch operators were convicted of theft or fraud because accounting software showed shortfalls, many of them caused by software bugs.' }],
    },
  },
}
